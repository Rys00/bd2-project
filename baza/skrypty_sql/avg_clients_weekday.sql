CREATE MATERIALIZED VIEW avg_customers_by_weekday_hour_mv AS
SELECT
    ROW_NUMBER() OVER (ORDER BY EXTRACT(DOW FROM o.date), EXTRACT(HOUR FROM o.date)) AS id,
    TO_CHAR(o.date, 'Day') AS weekday_name,
    EXTRACT(DOW FROM o.date) AS weekday_num,
    EXTRACT(HOUR FROM o.date) AS hour,
    ROUND(COUNT(*)::float / NULLIF(COUNT(DISTINCT DATE(o.date)), 0))::int AS avg_customers
FROM bufet_order o
WHERE o.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY weekday_name, weekday_num, hour;

CREATE UNIQUE INDEX ON avg_customers_by_weekday_hour_mv (weekday_num, hour);

REFRESH MATERIALIZED VIEW CONCURRENTLY avg_customers_by_weekday_hour_mv;