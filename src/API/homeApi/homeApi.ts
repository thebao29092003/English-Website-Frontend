import { apiConfig } from "../apiConfig/apiConfig";
import type { BaseResponse } from "../types/baseResponse";
import type { RecordingResponse } from "../types/homeApi.type";

export const homeApi = apiConfig.injectEndpoints({
  endpoints: (builder) => ({
    recording: builder.query<BaseResponse<RecordingResponse[]>, void>({
      query: () => ({
        url: "/api/home/recordings",
        method: "GET",
      }),
    }),
  }),
});

export const { useRecordingQuery } = homeApi;
