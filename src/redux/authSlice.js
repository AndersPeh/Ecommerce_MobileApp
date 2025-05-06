import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({

// name of the slice for referencing reducer actions later.
        name: "auth",

// set the initial state of authSlice as an object for adding more stuff in the future.
// currently, it is an object containing user, token and isAuthenticated.
        initialState: {
            user:null,
            token:null,
            isAuthenticated: false,
        },

// Each function in reducers of createSlice have state and action.
// state is the current state of this slice (authSlice) which is an object with null user, null token,
// and false isAuthenticated.
// which means no user, no token and not authenticated in the beginning.
// reducers is an object with information to update the state. 
        reducers: {

            signInSuccess: (state, action) => {

// update user and token passed from action.payload of UserProfile screen.
                state.user = action.payload.user;
                state.token = action.payload.token;

// isAuthenticated is updated to true after successfuly sign in. Dont need data passed from action.payload.
                state.isAuthenticated = true;
            },

// same logic as signInSuccess.
            signUpSuccess: (state, action) => {

// update user and token passed from action.payload of UserProfile screen.
                state.user = action.payload.user;
                state.token = action.payload.token;

// isAuthenticated is updated to true after successfuly sign up.
                state.isAuthenticated = true;
            },
            
// opposite of above 2, this clears everything
            signOut: (state) =>{

// update user and token to null.
                state.user = null;
                state.token = null;

// isAuthenticated is updated to false after logging out.
                state.isAuthenticated = false;
            },
            updateUserSuccess: (state, action) =>{

// after updating user profile, change the user name because only name and password can be updated.
// because React Native is client side, it should not store password.
// after the server takes the new password provided by UserProfile screen, it verifies the user's token,
// the database checks if user name and password are not empty,
// then executes SQL update to change the name and password stored in the users table 
// for that specific user ID.
// the query is update users set name = $name, password = $password where id = $id
                state.user.name = action.payload.name;
            },
        },
});

// export these actions to UserProfile screen to dispatch them later. they will be used as logic of buttons.
export const {signInSuccess, signUpSuccess, signOut, updateUserSuccess} = authSlice.actions;

// export to store.js to include this reducer so store knows how to manage state of authSlice using reducer.
// it will be imported as authReducer later because export default means it can be imported as any name.
export default authSlice.reducer;