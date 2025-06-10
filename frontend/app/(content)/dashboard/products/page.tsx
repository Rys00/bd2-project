import { ProductTable } from "@/components/tables/product-table";
import { getProductById } from "@/lib/backend-requests";

const OrderPage = async () => {
  return (
    <div>{<ProductTable data={[await getProductById(1)]}></ProductTable>}</div>
  );
};

export default OrderPage;
