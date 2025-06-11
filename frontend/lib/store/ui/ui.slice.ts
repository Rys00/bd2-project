import { createId } from "@paralleldrive/cuid2";
import { createSlice } from "@reduxjs/toolkit";
import { DispatchAction } from "../store";

export type SnackbarData = {
  id: string;
  message: string;
  timeout: number;
  type: "success" | "error" | "warning" | "information";
};

type UiState = {
  snackbars: SnackbarData[];
};

const INITIAL_STATE: UiState = {
  snackbars: [],
};

export const UiSlice = createSlice({
  name: "ui",
  initialState: INITIAL_STATE,
  reducers: {
    addSnackbar(
      state,
      action: DispatchAction<Partial<Omit<SnackbarData, "id">>>
    ) {
      state.snackbars.push({
        message: "",
        type: "information",
        timeout: 5000,
        ...action.payload,
        id: createId(),
      });
    },
    removeSnackbar(state, action: DispatchAction<SnackbarData["id"]>) {
      state.snackbars = state.snackbars.filter((s) => s.id !== action.payload);
    },
  },
});

export const { addSnackbar, removeSnackbar } = UiSlice.actions;

export const UiReducer = UiSlice.reducer;
