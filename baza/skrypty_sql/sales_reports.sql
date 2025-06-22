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
WITH all_days AS (
    SELECT generate_series(
        (SELECT MIN(DATE(date)) FROM bufet_order),
        CURRENT_DATE,
        INTERVAL '1 day'
    )::date AS day
),
real_data AS (
    SELECT
        DATE(o.date) AS day,
        COUNT(DISTINCT o.order_id) AS orders_count,
        SUM(o.sum) AS total_sales,
        SUM(o.total_profit) AS total_profit
    FROM bufet_order o
    GROUP BY DATE(o.date)
)
SELECT
    d.day,
    COALESCE(r.orders_count, 0) AS orders_count,
    COALESCE(r.total_sales, 0) AS total_sales,
    COALESCE(r.total_profit, 0) AS total_profit
FROM all_days d
LEFT JOIN real_data r ON r.day = d.day;

CREATE MATERIALIZED VIEW category_daily_report_mv AS
WITH all_days AS (
    SELECT generate_series(
        (SELECT MIN(DATE(date)) FROM bufet_order),
        CURRENT_DATE,
        INTERVAL '1 day'
    )::date AS day
),
all_categories AS (
    SELECT category_id, name AS category_name FROM bufet_productcategory
),
day_category_grid AS (
    SELECT d.day, c.category_id, c.category_name
    FROM all_days d CROSS JOIN all_categories c
),
aggregated_data AS (
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
    ROW_NUMBER() OVER (ORDER BY g.day, g.category_id) AS id,
    g.day,
    g.category_id,
    g.category_name,
    COALESCE(a.totals_sold, 0) AS totals_sold,
    COALESCE(a.total_value, 0) AS total_value,
    COALESCE(a.total_profit, 0) AS total_profit
FROM day_category_grid g
LEFT JOIN aggregated_data a
  ON a.day = g.day AND a.category_id = g.category_id;


CREATE INDEX idx_daily_report_mv_date ON daily_report_mv(day);

CREATE INDEX idx_daily_report_mv_profit ON daily_report_mv(total_profit);

CREATE INDEX idx_daily_report_mv_orders ON daily_report_mv(orders_count);


CREATE INDEX idx_category_daily_report_date_category
ON category_daily_report_mv(day, category_id);


CREATE UNIQUE INDEX CONCURRENTLY idx_daily_report_mv_unique
ON daily_report_mv (day);


CREATE UNIQUE INDEX CONCURRENTLY idx_category_daily_report_unique
ON category_daily_report_mv (day, category_id);

REFRESH MATERIALIZED VIEW CONCURRENTLY daily_report_mv;

REFRESH MATERIALIZED VIEW CONCURRENTLY category_daily_report_mv;