import { createReducer } from "@reduxjs/toolkit";
const inititialState ={}

export const userReducer = createReducer(inititialState,{

    LoginRequest: (state) => {
         state.loading = true;
    },
    LoginSuccess: (state,action) => {
        state.loading = false;
        state.user = action.payload;
    },
    LoginFailure: (state,action) => {
        state.loading = false;
        state.error = action.payload;
    },

    RegisterRequest: (state) => {
        state.loading = true;
    },
    RegisterSuccess: (state,action) => {
        state.loading = false;
        state.user = action.payload;
    },
    RegisterFailure: (state,action) => {
        state.loading = false;
        state.error = action.payload;
    },

    loadUserRequest: (state) => {
        state.loading = true;
    },
    loadUserSuccess: (state,action) => {
        state.loading = false;
        state.user = action.payload;
    },
    loadUserFailure: (state,action) => {
        state.loading = false;
        state.error = action.payload;
    },
    





});