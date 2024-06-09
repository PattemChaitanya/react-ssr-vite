const memory = {};

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterSliceReducer from "./CounterSlice";

export const allReducers = combineReducers({
  counter: counterSliceReducer,
});

const store = configureStore({
  reducer: allReducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== "production",
});

export const getPreloadedState = () => {
  const state = store.getState();
  Object.assign(memory, state);
  return memory;
};

export default store;
