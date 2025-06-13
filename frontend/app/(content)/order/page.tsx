import AddOrderView from "@/components/order-view";
import { getCategories } from "@/lib/backend-requests/misc";
import { getProducts } from "@/lib/backend-requests/products";

const OrderPage = async () => {
  return (
    <AddOrderView
      categories={await getCategories()}
      products={await getProducts("ACTIVE")}
    />
  );
};

export default OrderPage;
