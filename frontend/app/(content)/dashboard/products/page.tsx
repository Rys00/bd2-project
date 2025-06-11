"use client";

import { ProductTable } from "@/components/tables/product-table";
import { getProductById, ProductView } from "@/lib/backend-requests";
import { useEffect, useState } from "react";

const OrderPage = () => {
  const [products, setProducts] = useState<ProductView[]>([]);

  useEffect(() => {
    const exec = async () => {
      setProducts([await getProductById(1)]);
    };
    exec();
  }, []);

  return (
    <div>
      {products.length > 0 ? <ProductTable data={products}></ProductTable> : ""}
    </div>
  );
};

export default OrderPage;
