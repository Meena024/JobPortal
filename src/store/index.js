import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import recruiterReducer from "./recruiterSlice";
import jobReducer from "./jobSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    recruiter: recruiterReducer,
    jobs: jobReducer,
  },
});

export default store;
