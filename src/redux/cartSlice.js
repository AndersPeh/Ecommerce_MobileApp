import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
// name of the slice for referencing reducer actions later.
    name: "cart",
// set the initial state of cartSlice as an empty object for adding more stuff in the future.
// currently, it is an object containing products property which is an empty [].
    initialState: {
        products: [],
    },
// Each function in reducers of createSlice have state and action.
// state is the current state of this slice (cartSlice) which is an object with products as []
// which means empty shopping cart in the beginning.
// reducers is an object with information to update the state. 
    reducers: {
// reducer for user to add a product to the cart.
        addProduct: (state, action) =>{
// action usually consists of type and payload. Type is automatically generated
// based on slice and reducer name. For this action, the action.type will be cart/addProduct.
// action.payload contains data of dispatched action.
// when user adds a specific product, the productData is stored in action.payload.
// like { id: 1, name: "Jeans", price: 20 } stored in action.payload.
            const productToAdd = action.payload;
// If it is stored in the state, add 1
            const existingProduct = state.products.find(product =>
                product.id === productToAdd.id
            );
            if (existingProduct){
// increase the quantity of the specific object in products array.
                existingProduct.quantity +=1;
// if cant find it in state.products, push to the products array.
// it creates new object with extra information quantity like { id: 1, name: "Jeans", price: 20, quantity:1 }
// and push it to products array.
// so products array is an array containing multiple objects which are products information.
            } else {
                state.products.push({...productToAdd, quantity: 1});
            }
        },
// Action for user to increase quantity of added product.
        increaseQuantity: (state, action) => {
// user selects an existing product in the cart, the action.payload only needs to contain
// id to increase the quantity. no need to have other information.
            const {id} = action.payload;
            const productToIncrease = state.products.find(product => 
                product.id === id
            );
            if(productToIncrease){
                productToIncrease.quantity +=1;
            }
        },
// Action for user to decrease quantity of added product.
        decreaseQuantity: (state, action) => {
// user selects an existing product in the cart, the action.payload only needs to contain
// id to decrease the quantity. no need to have other information.
            const {id} = action.payload;
            const productToDecrease = state.products.find(product => 
                product.id === id
            );
// if more than 1, decrease 1.
            if(productToDecrease.quantity>1){
                productToDecrease.quantity -=1;
            }
            else{
// if quantity is <= 1, remove it from products array by creating a shallow copy with filter
                state.products = state.products.filter(product => product.id !== id);
            }
        },
// Action for user to remove an added product.
        removeProduct: (state, action) => {
// user selects an existing product in the cart, the action.payload only needs to contain
// id to remove the product. no need to have other information.
            const {id} = action.payload;
// remove the product from products array by creating a shallow copy with filter.
            state.products = state.products.filter(product => product.id !== id);
        },

// when user logs in, restore user's cart if any. If no product, leave it empty.
        setCart: (state, action) => {
// action.payload returns array of product details object from backend.
            state.products = action.payload || [];
        },

// when user signs out, clearCart for the next user.
        clearCart:(state, action) => {
            state.products=[];
        },
    },
});
// Export these actions for dispatching later. they will become the logic of buttons in 
// ProductDetail and MyCart screens.
export const { 
    addProduct, increaseQuantity, decreaseQuantity, removeProduct, setCart, clearCart
} = cartSlice.actions;
// Export the reducer for adding it to the store. The store will use it to define how the state
// for the cartSlice is managed.
// it will be imported as cartReducer later because export default means it can be imported as any name.
export default cartSlice.reducer;