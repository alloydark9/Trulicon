import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import vaultReducer from "./slices/vaultSlice"
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    vault: vaultReducer,
    user: userReducer,
  },
});

export default store;
