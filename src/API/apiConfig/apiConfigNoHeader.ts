import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { URL_DOT_NET } from "../urlBase";

// cấu hình api ko cần header ko cần cơ chế refresh token

const baseQuery = fetchBaseQuery({
  baseUrl: `${URL_DOT_NET}`,

  // Bắt buộc gửi cookies trong mọi request
  // (cần thiết nếu dùng HTTP Only Cookie (không thể truy cập bằng JavaScript → tăng bảo mật) để lưu refresh token).
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
  return result;
};

export const apiConfigNoHeader = createApi({
  reducerPath: "apiConfigNoHeader",
  baseQuery: baseQueryWithReauth,
  // Có thể thêm endpoints sau bằng injectEndpoints()
  endpoints: () => ({}),
});
