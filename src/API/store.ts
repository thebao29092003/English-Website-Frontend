import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./auth/authSlice";
import { apiConfigNoHeader } from "./apiConfig/apiConfigNoHeader";
import { apiConfig } from "./apiConfig/apiConfig";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiConfigNoHeader.reducerPath]: apiConfigNoHeader.reducer,
    [apiConfig.reducerPath]: apiConfig.reducer,
  },

  middleware: (getdefaultMiddleware) =>
    getdefaultMiddleware().concat(
      apiConfigNoHeader.middleware,
      apiConfig.middleware,
    ),
});

// 1. Suy luận kiểu dữ liệu 'RootState' từ chính hàm getState của store
export type RootState = ReturnType<typeof store.getState>;

// 2. Suy luận kiểu dữ liệu 'AppDispatch' để nhận diện được cả các Thunk Action
export type AppDispatch = typeof store.dispatch;

// Hàm này thiết lập các sự kiện lắng nghe (như focus hoặc online)
// để RTK Query có thể phản ứng với các hành động của trình duyệt.
// Nếu không gọi hàm này, refetchOnFocus sẽ không hoạt động.
setupListeners(store.dispatch);
