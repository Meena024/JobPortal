import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import recruiterReducer from "./recruiterSlice";
import jobReducer from "./jobSeekerSlice";
import adminReducer from "./adminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    recruiter: recruiterReducer,
    jobs: jobReducer,
    admin: adminReducer,
  },
});

export default store;
