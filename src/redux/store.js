import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice';

// the reducer here is how Redux will handle actions and update the app's state.
export const store = configureStore({
    reducer: {
// tell configureStore to create a redux store where the state object contains
// a property named cart and manage the data within state.cart using cartReducer.
        cart: cartReducer,
    },
});