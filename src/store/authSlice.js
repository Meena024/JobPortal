import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  userId: "",
  role: null,
  emailId: null,
  isInitialized: false,
  accountDeleted: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    AuthSet(state, action) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.emailId = action.payload.emailId;
      state.accountDeleted = false;
      state.isInitialized = true;
    },

    InitializationComplete(state) {
      state.isInitialized = true;
    },

    accountDeleted(state) {
      state.token = "";
      state.userId = "";
      state.role = null;
      state.emailId = null;
      state.accountDeleted = true;
      state.isInitialized = true;
    },

    logout(state) {
      state.token = "";
      state.userId = "";
      state.role = null;
      state.emailId = null;
      state.accountDeleted = false;
      state.isInitialized = true;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
