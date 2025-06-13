import { ProductView } from "@/lib/backend-requests/products";
import { Prisma } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { DispatchAction } from "../store";

type CartState = {
  items: { product: ProductView; amount: number }[];
  cartTotal: number;
};

const INITIAL_STATE: CartState = {
  items: [],
  cartTotal: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: INITIAL_STATE,
  reducers: {
    updateCart(
      state,
      action: DispatchAction<{ product: ProductView; amount: number }>
    ) {
      const { product, amount } = action.payload;
      const index = state.items.findIndex(
        (i) => i.product.product_id === product.product_id
      );
      if (index >= 0) {
        if (amount > 0) {
          const change = amount - state.items[index].amount;
          state.items[index].amount = amount;
          state.cartTotal +=
            new Prisma.Decimal(product.price).toNumber() * change;
        } else {
          state.cartTotal -=
            new Prisma.Decimal(product.price).toNumber() *
            state.items[index].amount;
          state.items = state.items.filter(
            (i) => i.product.product_id !== product.product_id
          );
        }
      } else {
        if (amount > 0) {
          state.items.push({
            product,
            amount,
          });
          state.cartTotal +=
            new Prisma.Decimal(product.price).toNumber() * amount;
        }
      }
    },
    purgeCart(state) {
      state.items = [];
      state.cartTotal = 0;
    },
  },
});

export const { updateCart, purgeCart } = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
