import { makeBackendRequest } from "@/utils/misc";
import { Allergen, Product, ProductCategory } from "@prisma/client";
import { AppDispatch } from "./store/store";

export type ProductView = Product & {
  category: ProductCategory;
  allergens: Allergen[];
};

export async function getProductById(
  id: Product["product_id"],
  dispatch?: AppDispatch
) {
  return await makeBackendRequest<ProductView>(`products/${id}`, dispatch);
}
