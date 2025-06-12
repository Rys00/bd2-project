import { makeBackendRequest } from "@/utils/misc";
import { Allergen, ProductCategory } from "@prisma/client";
import { AppDispatch } from "../store/store";

export async function getCategoryById(
  id: ProductCategory["category_id"],
  dispatch?: AppDispatch
) {
  return await makeBackendRequest<ProductCategory>(
    `products_category/${id}`,
    "GET",
    {},
    dispatch
  );
}

export async function getCategories(dispatch?: AppDispatch) {
  return await makeBackendRequest<ProductCategory[]>(
    `categories`,
    "GET",
    {},
    dispatch
  );
}

export async function getAllergenById(
  id: Allergen["allergen_id"],
  dispatch?: AppDispatch
) {
  return await makeBackendRequest<Allergen>(
    `allergens/${id}`,
    "GET",
    {},
    dispatch
  );
}

export async function getAllergens(dispatch?: AppDispatch) {
  return await makeBackendRequest<Allergen[]>(`allergens`, "GET", {}, dispatch);
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
