import { apiConfig } from "../apiConfig/apiConfig";
import type { BaseResponse } from "../types/baseResponse";
import type { UserAverageScoreResponse } from "../types/statistic.type";

export const statisticApi = apiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getUserAverageScore: builder.query<
      BaseResponse<UserAverageScoreResponse>,
      void
    >({
      query: () => ({
        url: "/api/statistic/user-average-score",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserAverageScoreQuery } = statisticApi;
