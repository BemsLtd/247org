import { configureStore } from "@reduxjs/toolkit";
import userDetailReducer from "./userinfo";

const store = configureStore({
  reducer: {
    userDetails: userDetailReducer,
  },
});

export default store;
