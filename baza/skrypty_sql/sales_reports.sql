CREATE OR REPLACE VIEW daily_report_today AS
SELECT
    CURRENT_DATE AS day,
    COUNT(DISTINCT o.order_id) AS orders_count,
    SUM(o.sum) as total_sales,
    SUM(o.total_profit) as total_profit
FROM bufet_order o
WHERE DATE(o.date) = CURRENT_DATE;

CREATE OR REPLACE VIEW category_daily_report_today AS
SELECT
    CURRENT_DATE as day,
    c.category_id,
    c.name as category_name,
    SUM(p.amount) as totals_sold,
    SUM(p.profit) as total_profit,
    SUM(p.value) as total_value
FROM bufet_orderposition p
JOIN bufet_order o ON p.order_id = o.order_id
JOIN bufet_product prod ON p.product_id = prod.product_id
JOIN bufet_productcategory c ON prod.category_id = c.category_id
WHERE DATE(o.date) = CURRENT_DATE
GROUP BY c.category_id, c.name;

CREATE MATERIALIZED VIEW daily_report_mv AS
SELECT
    DATE(o.date) AS day,
    COUNT(DISTINCT o.order_id) AS orders_count,
    SUM(o.sum) AS total_sales,
    SUM(o.total_profit) AS total_profit
FROM bufet_order o
GROUP BY DATE(o.date);

CREATE MATERIALIZED VIEW category_daily_report_mv AS
WITH aggregated_data AS (
    SELECT
        DATE(o.date) AS day,
        c.category_id,
        c.name AS category_name,
        SUM(p.amount) AS totals_sold,
        SUM(p.value) AS total_value,
        SUM(p.profit) AS total_profit
    FROM bufet_orderposition p
    JOIN bufet_order o ON p.order_id = o.order_id
    JOIN bufet_product prod ON p.product_id = prod.product_id
    JOIN bufet_productcategory c ON prod.category_id = c.category_id
    GROUP BY DATE(o.date), c.category_id, c.name
)
SELECT
    ROW_NUMBER() OVER (ORDER BY day, category_id) AS id,
    day,
    category_id,
    category_name,
    totals_sold,
    total_value,
    total_profit
FROM aggregated_data;



-- Indeks po dacie (np. filtrowanie raportów z danego okresu)
CREATE INDEX idx_daily_report_mv_date ON daily_report_mv(day);

-- Indeks po zysku (np. sortowanie po rentowności)
CREATE INDEX idx_daily_report_mv_profit ON daily_report_mv(total_profit);

-- Indeks po liczbie zamówień (np. sortowanie lub analiza najbardziej ruchliwych dni)
CREATE INDEX idx_daily_report_mv_orders ON daily_report_mv(orders_count);


CREATE INDEX idx_category_daily_report_date_category
ON category_daily_report_mv(day, category_id);


CREATE UNIQUE INDEX CONCURRENTLY idx_daily_report_mv_unique
ON daily_report_mv (day);

REFRESH MATERIALIZED VIEW CONCURRENTLY daily_report_mv;


CREATE UNIQUE INDEX CONCURRENTLY idx_category_daily_report_unique
ON category_daily_report_mv (day, category_id);

REFRESH MATERIALIZED VIEW CONCURRENTLY category_daily_report_mv;