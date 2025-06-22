CREATE INDEX idx_product_category_id ON bufet_product (category_id); -- using 'typical' index psql will choose the best option

CREATE INDEX idx_order_date ON bufet_order (date); -- as above

