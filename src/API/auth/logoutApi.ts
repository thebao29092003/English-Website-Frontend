import { apiConfig } from "../apiConfig/apiConfig";
import type { BaseResponse } from "../types/baseResponse";

export const logoutApi = apiConfig.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation<BaseResponse<null>, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useLogoutMutation } = logoutApi;
