CREATE MATERIALIZED VIEW product_stock_snapshot_mv AS
SELECT
    ROW_NUMBER() OVER (ORDER BY ps.product_id, current_date) AS id,
    CURRENT_DATE AS snapshot_date,
    p.product_id,
    p.name AS product_name,
    p.price,
    p.cost,
    ps.amount AS stock_amount
FROM bufet_productstock ps
JOIN bufet_product p ON ps.product_id = p.product_id;

CREATE UNIQUE INDEX idx_product_stock_snapshot_mv_id
ON product_stock_snapshot_mv (id);

CREATE INDEX idx_product_stock_snapshot_mv_date_product
ON product_stock_snapshot_mv (snapshot_date, product_id);

REFRESH MATERIALIZED VIEW CONCURRENTLY product_stock_snapshot_mv;
