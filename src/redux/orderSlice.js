import { createSlice } from "@reduxjs/toolkit";

export const orderSlice = createSlice({
// name of the slice for referencing reducer actions later.
    name: "order",
// set the initial state of orderSlice as an object for adding more stuff in the future.
// currently, it is an object containing orders which is empty [].
    initialState: {

        orders: [],
        newOrderQuantity: 0,
    },
    
// Each function in reducers of createSlice have state and action.
// state is the current state of this slice (orderSlice) which is an object with orders as []
// which means no order in the beginning.
// reducers is an object with information to update the state. 
    reducers: {

// reducer for user to add a new order.
        addNewOrder: (state, action) =>{

// store products from MyCart checkout to the beginning of the orders array.
// used unshift so new orders will appear first.
            state.orders.unshift(action.payload);

// count new orders in every action to ensure accuracy.
            state.newOrderQuantity = state.orders.filter(eachOrder=>{
                eachOrder.is_paid===0 && eachOrder.is_delivered===0
            }).length;

        },

// reducer for user to update payment status an order.
        updatePaid: (state, action) =>{

// only need the order id to update it.
            const id = action.payload;
            
// find that order with that id and update it.
            const findOrder = state.orders.find(each => 
                each.id === id
            );

            if (findOrder){
                findOrder.is_paid = 1;
                findOrder.is_delivered = 0;

            };

            // count new orders in every action to ensure accuracy.
            state.newOrderQuantity = state.orders.filter(eachOrder=>{
                eachOrder.is_paid===0 && eachOrder.is_delivered===0
            }).length;

        },

// reducer for user to update delivery of an order.
        updateDelivered: (state, action) =>{

// only need the order id to update it.
            const id = action.payload;
            
// find that order with that id and update it.
            const findOrder = state.orders.find(each => 
                each.id === id
            );

            if (findOrder){
                findOrder.is_paid = 1;
                findOrder.is_delivered = 1;
            };

            // count new orders in every action to ensure accuracy.
            state.newOrderQuantity = state.orders.filter(eachOrder=>{
                eachOrder.is_paid===0 && eachOrder.is_delivered===0
            }).length;

        },

// when user logs in, restore user's orders if any in the server. If no order, leave it empty.
        setOrders: (state, action) => {

// action.payload returns orders from backend.
            state.orders = action.payload || [];

            // count new orders in every action to ensure accuracy.
            state.newOrderQuantity = state.orders.filter(eachOrder=>{
                eachOrder.is_paid===0 && eachOrder.is_delivered===0
            }).length;
        },

// when user signs out, clear orders for the next user.
        clearOrders:(state, action) => {

            state.orders=[];

            state.newOrderQuantity = 0 ;

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