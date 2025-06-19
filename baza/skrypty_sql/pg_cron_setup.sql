CREATE EXTENSION pg_cron;
SELECT cron.schedule(
  'refresh_avg_customers_by_weekday_hour_mv_daily',      -- job name
  '0 3 * * *',                  -- cron syntax: minute hour day month day_of_week (3 AM daily)
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY avg_customers_by_weekday_hour_mv;$$
);
SELECT cron.schedule(
  'refresh_product_stock_snapshot_mv_mv_daily',      -- job name
  '0 3 * * *',                  -- cron syntax: minute hour day month day_of_week (3 AM daily)
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY product_stock_snapshot_mv;$$
);
SELECT cron.schedule(
  'refresh_daily_report_mv_daily',      -- job name
  '0 3 * * *',                  -- cron syntax: minute hour day month day_of_week (3 AM daily)
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY daily_report_mv;$$
);
SELECT cron.schedule(
  'refresh_category_daily_report_mv_daily',      -- job name
  '0 3 * * *',                  -- cron syntax: minute hour day month day_of_week (3 AM daily)
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY category_daily_report_mv;$$
);
