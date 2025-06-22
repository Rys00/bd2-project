CREATE OR REPLACE FUNCTION update_product_name_on_insert_ord_pst()
RETURNS TRIGGER AS $$
BEGIN
    SELECT name INTO NEW.product_name
    FROM bufet_product
    WHERE product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_product_name_on_insert_ord_pst
BEFORE INSERT ON bufet_orderposition
FOR EACH ROW
EXECUTE FUNCTION update_product_name_on_insert_ord_pst();