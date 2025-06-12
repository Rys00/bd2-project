import {
  addProduct,
  ProductView,
  updateProduct,
} from "@/lib/backend-requests/products";
import { useAppDispatch } from "@/lib/store/hooks";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import { Prisma, Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function ButtonDuplicateProduct({ product }: { product: ProductView }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function duplicate() {
    try {
      await addProduct({
        name: `${product.name} - kopia`,
        category_id: product.category.category_id,
        price: new Prisma.Decimal(product.price),
        cost: new Prisma.Decimal(product.cost),
        margin: product.margin,
        allergens: product.allergens.map((a) => a.allergen_id),
        active: product.active,
      });
      dispatch(
        addSnackbar({
          message: `Pomyślnie skopiowano produkt`,
          type: "success",
        })
      );
      router.refresh();
    } catch (error) {
      const message = (error as Error).message;
      if (message.startsWith("PWB_ERROR")) {
        dispatch(addSnackbar({ message, type: "error" }));
        return;
      }
      throw error;
    }
  }

  return (
    <DropdownMenuItem onClick={() => duplicate()}>Kopiuj</DropdownMenuItem>
  );
}

export function ButtonToggleProductActive({
  id,
  active: initial,
}: {
  id: Product["product_id"];
  active: Product["active"];
}) {
  const [active, setActive] = useState(initial);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function toggle(active: boolean) {
    try {
      await updateProduct(id, {
        active,
      });
      dispatch(
        addSnackbar({
          message: `Pomyślnie ${active ? "włączono" : "wyłączono"} produkt`,
          type: "success",
        })
      );
      setActive(active);
      router.refresh();
    } catch (error) {
      const message = (error as Error).message;
      if (message.startsWith("PWB_ERROR")) {
        dispatch(addSnackbar({ message, type: "error" }));
        return;
      }
      throw error;
    }
  }

  return (
    <DropdownMenuItem variant="destructive" onClick={() => toggle(!active)}>
      {active ? "Wyłącz" : "Włącz"}
    </DropdownMenuItem>
  );
}
