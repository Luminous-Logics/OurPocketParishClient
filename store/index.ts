import { configureStore } from "@reduxjs/toolkit";
import profile from "./slices/profile";
import permissions from "./slices/permissions";
import wards from "./slices/wards";
import families from "./slices/families";
import parishioners from "./slices/parishioners";
import church from "./slices/church";
import bible from "./slices/bible";

export const makeStore = () =>
  configureStore({
    reducer: {
      profile,
      permissions,
      wards,
      families,
      parishioners,
      church,
      bible
    },
  });

export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>;
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];
