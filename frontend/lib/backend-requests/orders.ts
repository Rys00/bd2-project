import { makeBackendRequest } from "@/utils/misc";
import { Order, Product } from "@prisma/client";
import { AppDispatch } from "../store/store";

export type OrderCreator = {
  items: {
    product_id: Product["product_id"];
    amount: number;
  }[];
};

export type OrderView = Order & {
  items: {
    product: Pick<Product, "product_id" | "name" | "price">;
    amount: number;
    value: Product["price"];
    profit: Product["price"];
  }[];
};

export async function getOrderById(
  id: Order["order_id"],
  dispatch?: AppDispatch
) {
  return await makeBackendRequest<OrderView>(
    `orders/${id}`,
    "GET",
    {},
    dispatch
  );
}

export async function getOrders(dispatch?: AppDispatch) {
  return await makeBackendRequest<OrderView[]>(`orders`, "GET", {}, dispatch);
}

export async function addOrder(data: OrderCreator, dispatch?: AppDispatch) {
  return await makeBackendRequest<OrderView>(
    `add/order`,
    "POST",
    data,
    dispatch
  );
}

export async function updateOrder(
  id: Order["order_id"],
  data: Partial<OrderCreator>,
  dispatch?: AppDispatch
) {
  return await makeBackendRequest<OrderView>(
    `update/order/${id}`,
    "PATCH",
    data,
    dispatch
  );
}
