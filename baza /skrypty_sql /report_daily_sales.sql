CREATE MATERIALIZED VIEW daily_sales_report AS
SELECT
    DATE("date") AS day,
    COUNT(order_id) AS total_orders,
    SUM("sum") AS total_sales,
    SUM(total_profit) AS daily_profil,
    ROUND(100.0 * SUM(total_profit) / NULLIF(SUM("sum"), 0), 2) AS obtained_avg_margin
FROM bufet_order
GROUP BY DATE(date)
ORDER BY day;