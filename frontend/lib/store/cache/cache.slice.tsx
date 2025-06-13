import { Allergen, ProductCategory } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { DispatchAction } from "../store";

type CacheState = {
  previousSessionStatus: "authenticated" | "unauthenticated" | undefined;
  categories: ProductCategory[];
  allergens: Allergen[];
};

const INITIAL_STATE: CacheState = {
  previousSessionStatus: undefined,
  categories: [],
  allergens: [],
};

export const cacheSlice = createSlice({
  name: "cache",
  initialState: INITIAL_STATE,
  reducers: {
    setPreviousSessionStatus(
      state,
      action: DispatchAction<"authenticated" | "unauthenticated">
    ) {
      state.previousSessionStatus = action.payload;
    },
    setCachedCategories(state, action: DispatchAction<ProductCategory[]>) {
      state.categories = action.payload;
    },
    setCachedAllergens(state, action: DispatchAction<Allergen[]>) {
      state.allergens = action.payload;
    },
  },
});

export const {
  setPreviousSessionStatus,
  setCachedCategories,
  setCachedAllergens,
} = cacheSlice.actions;

export const cacheReducer = cacheSlice.reducer;
