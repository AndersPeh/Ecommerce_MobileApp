import { configureStore } from "@reduxjs/toolkit";
// originally cartSlice.reducer
import cartReducer from './cartSlice';
// originally authSlice.reducer
import authReducer from './authSlice';

import orderReducer from './orderSlice';

// the reducer here is how Redux will handle actions and update the app's state.
export const store = configureStore({
    reducer: {
// tell configureStore to create a redux store where the state object contains
// a property named cart and manage the data within state.cart using cartReducer.
        cart: cartReducer,
// tell configureStote to create a redux store where the state object contains
// a property named auth and manage the data within state.auth using authReducer.
        auth: authReducer,

        order: orderReducer,

    },
});