import { makeBackendRequest } from "@/utils/misc";
import {
  Allergen,
  Product,
  ProductCategory,
  ProductStock,
} from "@prisma/client";
import { AppDispatch } from "../store/store";

export type ProductView = Product & {
  category: ProductCategory;
  allergens: Allergen[];
  stock_amount: ProductStock["amount"];
};

export type ProductCreator = Omit<Product, "product_id"> & {
  category_id: ProductCategory["category_id"];
  allergens: Allergen["allergen_id"][];
};

export type ProductStockView = ProductStock & {
  product: Pick<Product, "product_id" | "name"> & { category: ProductCategory };
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

export async function updateProduct(
  product_id: Product["product_id"],
  data: Partial<ProductCreator>,
  dispatch?: AppDispatch
) {
  return await makeBackendRequest<ProductView>(
    `update/product/${product_id}`,
    "PATCH",
    data,
    dispatch
  );
}

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
