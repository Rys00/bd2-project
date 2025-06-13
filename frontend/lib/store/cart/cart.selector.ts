import { createSelector } from "reselect";
import { RootState } from "../store";

const selectCartReducer = (state: RootState) => state.cart;

export const selectCartItems = createSelector(
  [selectCartReducer],
  (cartReducer) => cartReducer.items
);

export const selectCartTotal = createSelector(
  [selectCartReducer],
  (cartReducer) => cartReducer.cartTotal
);
