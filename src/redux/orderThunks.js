import { createAsyncThunk } from "@reduxjs/toolkit";
import { addNewOrder, setOrders, updatePaid, updateDelivered } from "./orderSlice";
import { clearCart } from "./cartSlice";

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

// get result by parsing the data.
            const data = await response.json();

            if(data.status!=='OK'){
                return rejectWithValue(data.message || 'Failed to fetch orders');
            }

// if data.orders is array, the user has history. not array means no history, so empty array.
// example from documentation:
// {
//     "status": "OK",
//     "orders": [
//       {
//         "id": 0,
//         "uid": 0,
//         "item_numbers": 0,
//         "total_price": 0,
//         "order_items": "string" >>> need to JSON.parse this
//       }
//     ]
//   }
            const ordersFromServer = Array.isArray(data.orders) ? data.orders : [];

// ensure only unique orders will be passed.
            const uniqueOrders = [];

            const seenOrderIds = new Set();

            for (const eachOrder of ordersFromServer){

// if new order, add it to unique and seen orders
                if(!seenOrderIds.has(eachOrder.id)){

                    uniqueOrders.push(eachOrder);
                    seenOrderIds.add(eachOrder.id);

// skip duplicate orders
                } else {
                    console.warn(`Duplicate order ID ${eachOrder.id} received from server, skipping.`)
                }
            }

// parse everything in order_items to ensure consistency.
// example above shows order_items is a string.
            const ordersWithParsedItems = uniqueOrders.map(eachOrder => {

                let parsedOrderItems = [];
                try {

// if order_items are string, parse it
                    if(typeof eachOrder.order_items === 'string'){

                        parsedOrderItems = JSON.parse(eachOrder.order_items);

// if it is already an array, store it directly. Most likely no.
                    } else if (Array.array(eachOrder.order_items)){

                        parsedOrderItems = eachOrder.order_items;
                    }
                } catch (e) {
                    console.error(`Failed to parse order_items for order ID ${eachOrder.id}:`, e);

                }
                
// return ordersWithParsedItems that consists of objects with eachOrder details and parsed order_items.
                return{
                    ...eachOrder,
                    order_items: parsedOrderItems
                };
            });


// dispatch setOrders with result from Get request that has been parsed to restore orders of the user.
// if no result, means user doesnt have anything which is [].
// it updates orders array in orderSlice which will be reflected in My Orders screen.
            dispatch(setOrders(ordersWithParsedItems ||[]));

// return ordersWithParsedItems as the payload of action order/fetchOrders/fulfilled to use it later
// in other actions below.
            return ordersWithParsedItems || [];

        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
      
);

export const createOrder = createAsyncThunk(
    'order/createOrder',

// must put orderData and token to dispatch createOrder
// createOrder desturctures using {}  orderData and token from MyCart dispatch.
    async({order_items, token}, {dispatch, rejectWithValue}) => {

        if(!token){
            return rejectWithValue('No token provided');
        }

        if(!order_items || order_items.length===0){
            return rejectWithValue('No product in the cart.');
        }

        try {

// pass orderProductsToSave data from My Cart screen to POST request.
// is_paid and is_delivered are automatically created in the backend.
            const orderProductsToSave = order_items.map(eachProduct => ({
                prodID: eachProduct.id,
                price: eachProduct.price,
                quantity: eachProduct.quantity,
                title: eachProduct.title,
                image: eachProduct.image,
            }));

            const response = await fetch(`${API_URL}/orders/neworder`, {
                method: 'POST',
                headers:{
// use Content-Type for POST and PUT requests to tell server what kind of data is being sent.
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`,
                },

// actual content sent to the server through request.
                body: JSON.stringify({items: orderProductsToSave}),
            });

// it will provide {status: "OK", id: newOrderId} if successful.
            const creationData = await response.json();

            if(creationData.status!=='OK'){
                return rejectWithValue(creationData.message || 'Failed to create order.');
            }

// get order id from backend server. Because the POST request only returns status and order id,
// need to fetch all orders to get the backend calculated item_numbers and total_price for new order.
// could have saved some steps if there is an API for getting specific order.
            const newOrderId = creationData.id;

// fetch all orders of the user from the server to get the backend calculated item_numbers and total_price.
// it returns result in data.orders in payload.
            const fetchResult = await dispatch(fetchOrders(token));

// declare fullOrderFrontend for later use.
            let fullOrderFrontend = null;

// fetchResult is the return of fetchOrders.fulfilled, they should match.
            if (fetchOrders.fulfilled.match(fetchResult)){

// data.orders is the payload, all orders of the user is received.
                const allOrders = fetchResult.payload;

// only need the order newly created, id of new order can be found from the result
// of the POST request that created the new order.
                const newlyCreatedOrder = allOrders.find(eachOrder=>eachOrder.id === newOrderId);

                if(newlyCreatedOrder){

// fullOrderFrontend to dispatch to orderSlice.
                    fullOrderFrontend = {

// use order data from the server to ensure accuracy.
                        id: newlyCreatedOrder.id,
                        item_numbers: newlyCreatedOrder.item_numbers,
                        total_price: newlyCreatedOrder.total_price,
                        order_items: newlyCreatedOrder.order_items,
                        is_paid: newlyCreatedOrder.is_paid,
                        is_delivered: newlyCreatedOrder.is_delivered,
        
                    };}
            } else{

                console.error('Order created, but failed to re-fetch orders list from server.');

                return rejectWithValue('Order created, but failed to re-fetch orders list from server.');
            }

// clear cart after checkout
            dispatch(clearCart());

// return new order data.
            return fullOrderFrontend;

        } catch (e) {
            return rejectWithValue(e.message);
        }
    }

);

export const updateOrder = createAsyncThunk(
    'order/updateOrder',

// must put id, is_paid, is_delivered and token to dispatch updateOrder
// updateOrder desturctures using {}  for data from MyOrder dispatch.
    async({id, is_paid, is_delivered, token}, {dispatch, rejectWithValue}) => {

        if(!token){
            return rejectWithValue('No token provided.');
        }

        if(!id){
            return rejectWithValue('Order ID must be provided.');
        }

// declare updateData as an object with order id inside.
        const updateData = {orderID: id};

        updateData.isPaid = is_paid;

        updateData.isDelivered = is_delivered;

        try {

            const response = await fetch(`${API_URL}/orders/updateorder`, {
                method: 'POST',
                headers:{
// use Content-Type for POST and PUT requests to tell server what kind of data is being sent.
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`,
                },

// actual content sent to the server through request.
                body: JSON.stringify(updateData),
            });

// it should return {status: "OK", result: {lastID, changes}}
            const data = await response.json();

            if(data.status!=='OK'){
                return rejectWithValue(data.message || 'Failed to update order.');
            }

// After successful backend update, dispatch updatePaid or updatedDelivered to update front end state.
            if(is_paid===1 && is_delivered===0){

                dispatch(updatePaid(id));

            } else if(is_delivered===1){

                dispatch(updateDelivered(id));
            }

// return the updated data object.
            return updateData;

        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
      
    

    
);