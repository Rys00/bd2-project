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
SELECT
    DATE(o.date) AS day,
    c.category_id,
    c.name AS category_name,
    SUM(p.amount) AS total_sold,
    SUM(p.value) AS total_value,
    SUM(p.profit) AS total_profit
FROM bufet_orderposition p
JOIN bufet_order o ON p.order_id = o.order_id
JOIN bufet_product prod ON p.product_id = prod.product_id
JOIN bufet_productcategory c ON prod.category_id = c.category_id
GROUP BY DATE(o.date), c.category_id, c.name;
