import { createSlice } from "@reduxjs/toolkit";

export const orderSlice = createSlice({
// name of the slice for referencing reducer actions later.
    name: "order",
// set the initial state of orderSlice as an object for adding more stuff in the future.
// currently, it is an object containing orders which is empty [].
    initialState: {

        orders: [],
    },
    
// Each function in reducers of createSlice have state and action.
// state is the current state of this slice (orderSlice) which is an object with orders as []
// which means no order in the beginning.
// reducers is an object with information to update the state. 
    reducers: {

// reducer for user to add a new order.
        addNewOrder: (state, action) =>{

// get products from MyCart checkout
            const productsNewOrder = action.payload;

// store products from MyCart checkout to orders array.
            state.orders.push({...productsNewOrder});
        },

// reducer for user to update payment status an order.
        updatePaid: (state, action) =>{

// only need the order id to update it.
            const {orderID} = action.payload;
            
// find that order with that id and update it.
            const findOrder = state.orders.find(each => {
                each.orderID === orderID
            });

            if (findOrder){
                findOrder.isPaid = 1;
            };

        },

// reducer for user to update delivery of an order.
        updateDelivered: (state, action) =>{

// only need the order id to update it.
            const {orderID} = action.payload;
            
// find that order with that id and update it.
            const findOrder = state.orders.find(each => {
                each.orderID === orderID
            });

            if (findOrder){
                findOrder.isDelivered = 1;
            };
    
        },

// when user logs in, restore user's orders if any in the server. If no order, leave it empty.
        setOrders: (state, action) => {

// action.payload returns orders from backend.
            state.orders = action.payload || [];
        },

// when user signs out, clear orders for the next user.
        clearOrders:(state, action) => {
            state.orders=[];

        },
    },
});

// Export these actions for dispatching later. they will become the logic of buttons in 
// MyOrder screen.
export const { 
    addNewOrder, setOrders, clearOrders, updateDelivered, updatePaid
} = orderSlice.actions;

// Export the reducer for adding it to the store. The store will use it to define how the state
// for the orderSlice is managed.
// it will be imported as orderReducer later because export default means it can be imported as any name.
export default orderSlice.reducer;