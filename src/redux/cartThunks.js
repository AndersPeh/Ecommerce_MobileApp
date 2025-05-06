import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCart } from "./cartSlice";

// URL to run on local machine
const API_URL = 'http://10.0.2.2:3000'; 

// create a new async thunk named fetchCart, it takes 2 arguments.
export const fetchCart = createAsyncThunk(

// first argument is the name/actionName like slice in redux which use name+actionName.
    'cart/fetchCart',

// second argument is async payload creator function 
// that executes logic like making API request and 
// return payload.
    async(token, {dispatch, rejectWithValue}) => {
// token is needed to dispatch fetchCart for authorisation check.
// for example, dispatch(fetchCart(token)).

// dispatch is for dispatching other actions inside the thunk
// rejectWithValue handles errors. thunk cart/fetchCart/reject will be dispatched 
// with the rejectWithValue as the payload.

        if(!token){
            return rejectWithValue('No token provided');
        }

        try {
// sends GET request to retrieve cart information.
            const response = await fetch(`${API_URL}/cart`, {
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
                return rejectWithValue(data.message || 'Failed to fetch cart');
            }

// dispatch setCart with result from Get request to restore cart of the user.
// if no result, means user doesnt have anything which is [].
// it updates products array in cartSlice which will be reflected in My Cart screen.
            dispatch(setCart(data.items ||[]));

// return product items as the payload of action cart/fetchCart/fulfilled automatically to signal success.
            return data.items || [];

        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
      
);

export const saveCart = createAsyncThunk(
    'cart/saveCart',

// must put products and token to dispatch saveCart
// For example, dispatch(saveCart({products:currentCartProducts, token:token}))
// saveCart desturctures using {}  products and token from MyCart dispatch.
// not dispatching action this time, directly talk to server, only need rejectWithValue
    async({products, token}, {rejectWithValue}) => {
        if(!token){
            return rejectWithValue('No token provided');
        }

        try {
// pass products input to PUT request
            const productsToSave = products.map(product => ({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: product.quantity,
            }));

            const response = await fetch(`${API_URL}/cart`, {
                method: 'PUT',
                headers:{
// use Content-Type for POST and PUT requests to tell server what kind of data is being sent.
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`,
                },
// actualt content sent to the server through PUT request.
                body: JSON.stringify({items: productsToSave}),
            });

            const data = await response.json();

            if(data.status!=='OK'){
                return rejectWithValue(data.message || 'Failed to save cart');
            }
// return data object as the payload of action cart/saveCart/fulfilled to signal success.
            return data;

        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
      
);