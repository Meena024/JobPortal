import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token"),

  userId: localStorage.getItem("userId"),

  role: localStorage.getItem("role"),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login(state, action) {
      state.token = action.payload.token;

      state.userId = action.payload.userId;

      state.role = action.payload.role;
    },

    logout(state) {
      state.token = null;

      state.userId = null;

      state.role = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
