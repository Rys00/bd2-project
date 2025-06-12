import { ProductTable } from "@/components/tables/product-table";
import { getProducts } from "@/lib/backend-requests/products";

const OrderPage = async () => {
  return <div>{<ProductTable data={await getProducts()}></ProductTable>}</div>;
};

export default OrderPage;
