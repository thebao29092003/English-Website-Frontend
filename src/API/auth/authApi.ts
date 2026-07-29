import { apiConfigNoHeader } from "../apiConfig/apiConfigNoHeader";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequestStep2,
  ResetPasswordRequest,
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

    getOtp: builder.query<
      BaseResponse<null>,
      { email: string; turnstileToken: string }
    >({
      query: ({ email, turnstileToken }) => ({
        url: "/api/auth/register/send-otp",
        method: "GET",
        params: {
          email,
          turnstileToken,
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

    forgotPasswordSendOtp: builder.query<
      BaseResponse<null>,
      { email: string; turnstileToken: string }
    >({
      query: ({ email, turnstileToken }) => ({
        url: "/api/forget-password/send-otp",
        method: "GET",
        params: {
          email,
          turnstileToken,
        },
      }),
    }),

    resetPassword: builder.mutation<BaseResponse<null>, ResetPasswordRequest>({
      query: (params) => ({
        url: "/api/forget-password/reset",
        method: "POST",
        body: params,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyGetOtpQuery,
  useRegisterMutation,
  useLazyForgotPasswordSendOtpQuery,
  useResetPasswordMutation,
} = authApi;
