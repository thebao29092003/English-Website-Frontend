// những api nào cần header có token thì phải dùng này có cơ chế prepare header
// để gán token vào header và cơ chế refresh token

import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { URL_DOT_NET } from "../urlBase";
import { logout } from "../auth/authSlice";
import { setCredentials } from "../auth/authSlice";
import type { RefreshResponse } from "../types/authApi.type";
import type { RootState } from "../store";

// cấu hình api có xét header có cần cơ chế refresh token
const baseQuery = fetchBaseQuery({
  baseUrl: `${URL_DOT_NET}`,

  // Bắt buộc gửi cookies trong mọi request
  // (cần thiết nếu dùng HTTP Only Cookie (không thể truy cập bằng JavaScript → tăng bảo mật) để lưu refresh token).
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    //  lấy token từ cái authSlice
    const token = (getState() as RootState).auth?.token;
    console.log("token in authApi", token);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // console.log("headers in authApi", headers.get("Authorization"));
    return headers;
  },
});

// Tạo baseQuery đơn giản KHÔNG có cơ chế reauth để tránh
// vòng lặp vô hạn vì refresh token ko cần header
const simpleBaseQuery = fetchBaseQuery({
  baseUrl: `${URL_DOT_NET}`,
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // gọi api với request gốc
  let result = await baseQuery(args, api, extraOptions);
  console.log("result", result);

  // nếu accesstoken bị lỗi do hết hạn thì sẽ gửi refresht token
  if (result?.error?.status === "FETCH_ERROR" || result?.error?.status == 401) {
    try {
      //  Sử dụng simpleBaseQuery thay vì baseQuery vì refresh ko cần header
      //  có token
      const refreshResult = await simpleBaseQuery(
        {
          url: "/api/auth/refresh-token",
          method: "POST",
        },
        api,
        extraOptions,
      );

      const refreshData = refreshResult.data as RefreshResponse | undefined;

      console.log("refreshResult", refreshData?.value);

      // nếu không có token mới trả về thì có nghĩa là refresh hết hạn => logout
      if (!refreshData?.value) {
        api.dispatch(logout());
        // chuyển về trang chủ
        window.location.replace("/");
        return result;
      }

      // nếu refresh token gửi đi (trong cookies) hợp lệ và nhận được accesstoken mới
      // Lấy thông tin user từ Redux store
      const state = api.getState() as RootState;
      const user = state.auth?.user;
      const token = refreshData.value;

      if (user) {
        // Cập nhật token mới vào store
        api.dispatch(setCredentials({ user, token }));

        // Thử lại request gốc với token mới
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
        window.location.replace("/");
      }
    } catch (error) {
      console.log("refreshResult error", error);
      api.dispatch(logout());
    }
  }
  return result;
};

export const apiConfig = createApi({
  reducerPath: "apiConfig",
  baseQuery: baseQueryWithReauth,
  // Có thể thêm endpoints sau bằng injectEndpoints()
  endpoints: () => ({}),
});
