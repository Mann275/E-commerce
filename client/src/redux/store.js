import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import productSlice from "./productSlice.js";
import cartSlice from "./cartSlice.js";
import wishlistSlice from "./wishlistSlice.js";

const store = configureStore({
  reducer: {
    user: userSlice,
    product: productSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
  },
});

export default store;
