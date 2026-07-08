import { apiConfigNoHeader } from "../apiConfig/apiConfigNoHeader";

export const authApi = apiConfigNoHeader.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (emailPw) => ({
        url: "/api/auth/login",
        method: "POST",
        body: emailPw,
      }),
    }),

    getOtp: builder.query({
      query: (email) => ({
        url: "/api/auth/register",
        method: "GET",
        params: {
          email,
        },
      }),
    }),

    register: builder.mutation({
      query: (email) => ({
        url: "/api/auth/register",
        method: "POST",
        params: {
          email,
        },
      }),
    }),
  }),
});

export const { useLoginMutation, useGetOtpQuery } = authApi;
