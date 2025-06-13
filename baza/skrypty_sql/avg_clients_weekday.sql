CREATE MATERIALIZED VIEW avg_customers_by_weekday_hour_mv AS
WITH all_hours AS (
    SELECT generate_series(0, 23) AS hour
),
all_weekdays AS (
    SELECT generate_series(0, 6) AS weekday_num
),
base_grid AS (
    SELECT
        w.weekday_num,
        h.hour,
        TO_CHAR((DATE '2024-06-09' + w.weekday_num), 'Day') AS weekday_name
    FROM all_weekdays w CROSS JOIN all_hours h
),
real_data AS (
    SELECT
        EXTRACT(DOW FROM o.date) AS weekday_num,
        EXTRACT(HOUR FROM o.date) AS hour,
        ROUND(COUNT(*)::float / NULLIF(COUNT(DISTINCT DATE(o.date)), 0))::int AS avg_customers
    FROM bufet_order o
    WHERE o.date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY weekday_num, hour
)
SELECT
    ROW_NUMBER() OVER (ORDER BY b.weekday_num, b.hour) AS id,
    b.weekday_name,
    b.weekday_num,
    b.hour,
    COALESCE(r.avg_customers, 0) AS avg_customers
FROM base_grid b
LEFT JOIN real_data r
  ON r.weekday_num = b.weekday_num AND r.hour = b.hour;

CREATE UNIQUE INDEX ON avg_customers_by_weekday_hour_mv (weekday_num, hour);

REFRESH MATERIALIZED VIEW CONCURRENTLY avg_customers_by_weekday_hour_mv;