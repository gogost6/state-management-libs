import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi";
import authReducer from "../features/auth/authSlice";
import { catApi } from "../features/cat/catApi";
import { commentsApi } from "../features/comments/commentsApi";
import counterReducer from "../features/counter/counterSlice";
import { postsApi } from "../features/posts/postsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [catApi.reducerPath]: catApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      postsApi.middleware,
      authApi.middleware,
      commentsApi.middleware,
      catApi.middleware,
    ),
});
