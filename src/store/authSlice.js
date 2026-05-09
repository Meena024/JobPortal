import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token"),

  userId: localStorage.getItem("userId"),

  role: localStorage.getItem("role"),

  emailId: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login(state, action) {
      state.token = action.payload.token;

      state.userId = action.payload.userId;

      state.role = action.payload.role;

      state.emailId = action.payload.emailId;
    },

    logout(state) {
      state.token = null;

      state.userId = null;

      state.role = null;

      state.emailId = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
