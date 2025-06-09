import { createSelector } from "reselect";
import { RootState } from "../store";

const selectUiReducer = (state: RootState) => state.ui;

export const selectSnackbars = createSelector(
  [selectUiReducer],
  (uiReducer) => uiReducer.snackbars
);
