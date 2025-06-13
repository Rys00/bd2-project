"use client";

import { ProductOrderTable } from "@/components/tables/product-order-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addOrder } from "@/lib/backend-requests/orders";
import { ProductView } from "@/lib/backend-requests/products";
import {
  selectCartItems,
  selectCartTotal,
} from "@/lib/store/cart/cart.selector";
import { purgeCart } from "@/lib/store/cart/cart.slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import { ProductCategory } from "@prisma/client";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

const AddOrderView = ({
  categories,
  products,
}: {
  categories: ProductCategory[];
  products: ProductView[];
}) => {
  const [filter, setFilter] = useState("");
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const dispatch = useAppDispatch();
  const categoriesData = categories.map((c) => ({
    category: c,
    products: products.filter(
      (p) =>
        p.category.category_id === c.category_id &&
        (!filter ||
          p.name
            .toUpperCase()
            .split(" ")
            .some((word) => word.startsWith(filter.toUpperCase())))
    ),
  }));

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
    <div>
      <div className="min-h-150 flex flex-col justify-between">
        <ProductOrderTable
          title={"Zamówienie"}
          data={cartItems.map((i) => i.product)}
          noItemLabel="Nie dodano żadnych produktów do zamówienia."
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
      <div className="px-20 flex pt-6 flex-col">
        <h2 className="mb-6 text-2xl">Dodaj do zamówienia:</h2>
        <div className="*:not-first:mt-2">
          <Label htmlFor="filter">Filtruj po nazwie</Label>
          <div className="relative">
            <Input
              id="filter"
              className="peer ps-9 pe-9"
              placeholder="(np. baton)"
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Submit search"
              type="submit"
            >
              <ArrowRightIcon size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      {(filter
        ? categoriesData.toSorted(
            (a, b) => b.products.length - a.products.length
          )
        : categoriesData
      ).map(({ category, products }) => (
        <div key={category.category_id}>
          <ProductOrderTable
            title={category.name}
            data={products}
          ></ProductOrderTable>
        </div>
      ))}
    </div>
  );
};

export default AddOrderView;
