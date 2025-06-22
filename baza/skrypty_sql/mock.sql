CREATE MATERIALIZED VIEW product_stock_snapshot_mv AS
SELECT
    ROW_NUMBER() OVER (ORDER BY g.snapshot_date, p.product_id) AS id,
    g.snapshot_date,
    p.product_id,
    p.name AS product_name,
    ROUND(p.price + ((random() - 0.5) * 0.2)::numeric, 2) AS price,
    ROUND(p.cost + ((random() - 0.5) * 0.2)::numeric, 2) AS cost,
    GREATEST(0, ps.amount + (floor(random() * 10) - 5)::int) AS stock_amount
FROM (
    SELECT generate_series('2025-05-15'::date, '2025-06-13'::date, interval '1 day') AS snapshot_date
) g
CROSS JOIN bufet_product p
JOIN bufet_productstock ps ON ps.product_id = p.product_id;