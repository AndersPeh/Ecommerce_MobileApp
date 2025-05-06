import { createAsyncThunk } from "@reduxjs/toolkit";
import { addNewOrder, setOrders } from "./orderSlice";

// Thunks usually match number of API for each screen because each action here handles 1 API.

// URL to run on local machine
const API_URL = 'http://10.0.2.2:3000'; 

// create a new async thunk named fetchOrders, it takes 2 arguments.
export const fetchOrders = createAsyncThunk(

// first argument is the name/actionName like slice in redux which use name+actionName.
    'order/fetchOrders',

// second argument is async payload creator function 
// that executes logic like making API request and 
// return payload.
    async(token, {dispatch, rejectWithValue}) => {
// token is needed to dispatch fetchOrders for authorisation check.

// dispatch is for dispatching other actions inside the thunk
// rejectWithValue handles errors. thunk cart/fetchOrders/reject will be dispatched 
// with the rejectWithValue as the payload.

        if(!token){
            return rejectWithValue('No token provided');
        }

        try {
// sends GET request to retrieve orders information.
            const response = await fetch(`${API_URL}/orders/all`, {
                method: 'GET',
                headers:{
                    'Authorization':`Bearer ${token}`,

// use Accept in GET request to specify what kind of data format the user wants to accept.
                    'Accept': 'application/json',
                },
            });
// get result
            const data = await response.json();

            if(data.status!=='OK'){
                return rejectWithValue(data.message || 'Failed to fetch orders');
            }

// dispatch setOrders with result from Get request to restore orders of the user.
// if no result, means user doesnt have anything which is [].
// it updates orders array in orderSlice which will be reflected in My Orders screen.
            dispatch(setOrders(data.items ||[]));

// return orders items as the payload of action order/fetchOrders/fulfilled automatically to signal success.
            return data.items || [];

        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
      
);

export const createOrder = createAsyncThunk(
    'order/createOrder',

// must put orderData and token to dispatch createOrder
// createOrder desturctures using {}  orderData and token from MyCart dispatch.
    async({orderData, token}, {dispatch, rejectWithValue}) => {

        if(!token){
            return rejectWithValue('No token provided');
        }

        try {

// pass orderToSave input to POST request
            const orderToSave = {
                item_numbers: orderData.totalItems,
                total_price: orderData.totalPrice,

// server stores order_items as JSON
                order_items: JSON.stringify(orderData.order_items),
// new order default is false for Paid and Delivered.
                isPaid: 0,
                isDelivered: 0,
            }

            const response = await fetch(`${API_URL}/orders/neworder`, {
                method: 'POST',
                headers:{
// use Content-Type for POST and PUT requests to tell server what kind of data is being sent.
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`,
                },

// actual content sent to the server through request.
                body: JSON.stringify({items: orderToSave}),
            });

            const data = await response.json();

            if(data.status!=='OK'){
                return rejectWithValue(data.message || 'Failed to create order.');
            }

// fullOrder to dispatch to orderSlice
            const fullOrder = {

// use unique ID from the server. The rest is same as orderToSave
                orderID: data.id,
                item_numbers: orderToSave.item_numbers,
                total_price: orderToSave.total_price,
                order_items: orderToSave.order_items,
                isPaid:0,
                isDelivered:0,

            }
// return 
            return dispatch(addNewOrder(fullOrder));

        } catch (e) {
            return rejectWithValue(e.message);
        }
    }

);

export const updateOrder = createAsyncThunk(
    'order/updateOrder',

// must put updateData and token to dispatch updateOrder
// updateOrder desturctures using {}  updateData and token from MyOrder dispatch.
// not dispatching action this time, directly talk to server, only need rejectWithValue
    async(updateData, {rejectWithValue}) => {

        const {orderID, isPaid, isDelivered, token} = updateData;

        if(!token){
            return rejectWithValue('No token provided.');
        }

        if(!orderID){
            return rejectWithValue('Order ID must be provided.');
        }

// either must be provided, reject if both are undefined.
        if(isPaid===undefined && isDelivered==undefined){
            return rejectWithValue('Either isPaid or isDelivered must be provided.');
        }

        // pass updateToSave to POST request
        const updateToSave = {
            orderID: orderID,
        };

// if isPaid is valid, update it
        if(isPaid !== undefined){
            updateToSave.isPaid = isPaid;
            updateToSave.isDelivered = 0;
        }

// if isDelivered is valid, update it
        if(isDelivered !== undefined){
            updateToSave.isPaid = 1;
            updateToSave.isDelivered = isDelivered;
        }


        try {

            const response = await fetch(`${API_URL}/orders/updateorder`, {
                method: 'POST',
                headers:{
// use Content-Type for POST and PUT requests to tell server what kind of data is being sent.
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`,
                },

// actual content sent to the server through request.
                body: JSON.stringify(updateToSave),
            });

            const data = await response.json();

            if(data.status!=='OK'){
                return rejectWithValue(data.message || 'Failed to update order.');
            }

// return data object as the payload of action order/updateOrder/fulfilled to signal success.
            return data;

        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
      
    

    
);