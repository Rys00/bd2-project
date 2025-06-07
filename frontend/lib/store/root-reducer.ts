import { combineReducers } from "@reduxjs/toolkit";
import { cacheReducer } from "./cache/cache.slice";
import { UiReducer } from "./ui/ui.slice";
import { userReducer } from "./user/user.slice";

export const rootReducer = combineReducers({
  user: userReducer,
  ui: UiReducer,
  cache: cacheReducer,
});
