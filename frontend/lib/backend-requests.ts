import { makeBackendRequest } from "@/utils/misc";
import {
  Allergen,
  Order,
  Product,
  ProductCategory,
  ProductStock,
} from "@prisma/client";
import { AppDispatch } from "./store/store";

export type ProductView = Product & {
  category: ProductCategory;
  allergens: Allergen[];
};

export async function getProductById(
  id: Product["product_id"],
  dispatch?: AppDispatch
) {
  return await makeBackendRequest<ProductView>(
    `products/${id}`,
    "GET",
    {},
    dispatch
  );
}

export async function getProducts(dispatch?: AppDispatch) {
  return await makeBackendRequest<ProductView[]>(
    `products`,
    "GET",
    {},
    dispatch
  );
}

export async function getProductsById(
  id: ProductCategory["category_id"],
  dispatch?: AppDispatch
) {
  return await makeBackendRequest<ProductCategory>(
    `category/${id}`,
    "GET",
    {},
    dispatch
  );
}

export async function getProductsByCategoryId(
  id: ProductCategory["category_id"],
  dispatch?: AppDispatch
) {
  return await makeBackendRequest<ProductView[]>(
    `category/${id}/products`,
    "GET",
    {},
    dispatch
  );
}

export async function getOrders(dispatch?: AppDispatch) {
  return await makeBackendRequest<ProductView[]>(`orders`, "GET", {}, dispatch);
}

export async function addCategory(
  name: ProductCategory["name"],
  dispatch?: AppDispatch
) {
  return await makeBackendRequest<ProductCategory>(
    `add/product_category`,
    "POST",
    {
      name,
    },
    dispatch
  );
}

export async function addAllergen(
  name: Allergen["name"],
  dispatch?: AppDispatch
) {
  return await makeBackendRequest<Allergen>(
    `add/allergen`,
    "POST",
    {
      name,
    },
    dispatch
  );
}

type ProductCreator = Omit<Product, "product_id"> & {
  category_id: ProductCategory["category_id"];
  allergens: Allergen["allergen_id"][];
};

export async function addProduct(
  product: ProductCreator,
  dispatch?: AppDispatch
) {
  return await makeBackendRequest<ProductView>(
    `add/product`,
    "POST",
    product,
    dispatch
  );
}

type OrderCreator = {
  items: {
    product_id: Product["product_id"];
    amount: number;
  }[];
};

type OrderView = Order & {
  items: {
    product: Pick<Product, "product_id" | "name" | "price">;
    amount: number;
    value: Product["price"];
    profit: Product["price"];
  }[];
};

export async function addOrder(data: OrderCreator, dispatch?: AppDispatch) {
  return await makeBackendRequest<OrderView>(
    `add/order`,
    "POST",
    data,
    dispatch
  );
}

type ProductStockView = ProductStock & {
  product: Pick<Product, "product_id" | "name"> & { category: ProductCategory };
};

export async function updateStock(
  data: {
    updates: {
      product_id: Product["product_id"];
      change: number;
    }[];
  },
  dispatch?: AppDispatch
) {
  return await makeBackendRequest<ProductStockView[]>(
    `update/stocks`,
    "PUT",
    data,
    dispatch
  );
}
