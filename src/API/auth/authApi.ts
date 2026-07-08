import { apiConfigNoHeader } from "../apiConfig/apiConfigNoHeader";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequestStep2,
} from "../types/authApi.type";
import type { BaseResponse } from "../types/baseResponse";

export const authApi = apiConfigNoHeader.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (emailPw) => ({
        url: "/api/auth/login",
        method: "POST",
        body: emailPw,
      }),
    }),

    getOtp: builder.query<BaseResponse<null>, string>({
      query: (email) => ({
        url: "/api/auth/register",
        method: "GET",
        params: {
          email,
        },
      }),
    }),

    register: builder.mutation<BaseResponse<null>, RegisterRequestStep2>({
      query: (params) => ({
        url: "/api/auth/register",
        method: "POST",
        body: params,
      }),
    }),
  }),
});

export const { useLoginMutation, useGetOtpQuery, useRegisterMutation } =
  authApi;
