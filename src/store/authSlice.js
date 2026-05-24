import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  userId: "",
  role: null,
  emailId: null,
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
