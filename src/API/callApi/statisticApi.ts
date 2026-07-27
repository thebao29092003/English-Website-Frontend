import { apiConfig } from "../apiConfig/apiConfig";
import type { BaseResponse } from "../types/baseResponse";
import type {
  UserAverageScoreResponse,
  DailyScoreParams,
  DailyScoreResponse,
} from "../types/statistic.type";

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

    getDailyScores: builder.query<
      BaseResponse<DailyScoreResponse[]>,
      DailyScoreParams
    >({
      query: (params) => ({
        url: "/api/statistic/daily-scores",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetUserAverageScoreQuery, useGetDailyScoresQuery } =
  statisticApi;
