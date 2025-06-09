CREATE MATERIALIZED VIEW report_clients_avg_per_hour_last_30days AS
SELECT
    week_day,
    time_slot,
    AVG(clients) AS clients_avg
FROM (
    SELECT
        DATE_TRUNC('hour', date) AS hour_start,
        EXTRACT(DOW FROM date) AS week_day,
        EXTRACT(HOUR FROM date) AS time_slot,
        COUNT(DISTINCT order_id) AS clients
    FROM bufet_order
    WHERE date >= NOW() - INTERVAL '30 days'
    GROUP BY hour_start, week_day, time_slot
) sub
GROUP BY week_day, time_slot
ORDER BY week_day, time_slot;