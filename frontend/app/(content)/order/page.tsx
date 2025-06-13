"use client";

import { ProductOrderTable } from "@/components/tables/product-order-table";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/backend-requests/misc";
import { addOrder } from "@/lib/backend-requests/orders";
import { getProducts, ProductView } from "@/lib/backend-requests/products";
import {
  selectCartItems,
  selectCartTotal,
} from "@/lib/store/cart/cart.selector";
import { purgeCart } from "@/lib/store/cart/cart.slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import { ProductCategory } from "@prisma/client";
import { useEffect, useState } from "react";

const OrderPage = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<ProductView[]>([]);
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const dispatch = useAppDispatch();

  async function add() {
    try {
      await addOrder(
        {
          items: cartItems.map((i) => ({
            product_id: i.product.product_id,
            amount: i.amount,
          })),
        },
        dispatch
      );
      dispatch(
        addSnackbar({
          message: `Pomyślnie złożono zamówienie`,
          type: "success",
        })
      );
      dispatch(purgeCart());
      refresh();
    } catch (error) {
      const message = (error as Error).message;
      if (message.startsWith("PWB_ERROR")) {
        dispatch(addSnackbar({ message, type: "error" }));
        return;
      }
      throw error;
    }
  }

  const refresh = async () => {
    setCategories(await getCategories(dispatch));
    setProducts(await getProducts("ACTIVE", dispatch));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="min-h-150 flex flex-col justify-between">
        <ProductOrderTable
          title={"Zamówienie"}
          data={cartItems.map((i) => i.product)}
        ></ProductOrderTable>
        <div className="flex justify-end">
          <div className="px-10 pb-6 text-xl flex flex-col gap-3">
            <span className="text-right pr-10">
              Suma: {Math.round(cartTotal * 100) / 100} zł
            </span>
            <div className="flex gap-2">
              <Button
                onClick={() => dispatch(purgeCart())}
                size={"lg"}
                variant={"outline"}
              >
                Anuluj zamówienie
              </Button>
              <Button onClick={() => add()} size={"lg"}>
                Złóż zamówienie
              </Button>
            </div>
          </div>
        </div>
      </div>
      <h2 className="pt-6 pl-20 text-2xl">Dodaj do zamówienia:</h2>
      {categories.map((category) => (
        <div key={category.category_id}>
          <ProductOrderTable
            title={category.name}
            data={products.filter(
              (p) => p.category.category_id === category.category_id
            )}
          ></ProductOrderTable>
        </div>
      ))}
    </div>
  );
};

export default OrderPage;
