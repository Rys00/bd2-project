import { ProductTable } from "@/components/tables/product-table";
import { getProductById, ProductView } from "@/lib/backend-requests";

const OrderPage = async () => {
  let products: ProductView[] = [];
  try {
    products = [await getProductById(1)];
  } catch (error) {
    console.log(error);
  }

  return <div>{<ProductTable data={products}></ProductTable>}</div>;
};

export default OrderPage;
