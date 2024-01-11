import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Features/userSlice";
import postReducer from "../Features/postSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
  },
});

export default store;
