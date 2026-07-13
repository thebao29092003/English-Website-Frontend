import { apiConfig } from "../apiConfig/apiConfig";
import type { BaseResponse } from "../types/baseResponse";
import type { RecordingResponse, AudioDetailValue } from "../types/homeApi.type";

export const homeApi = apiConfig.injectEndpoints({
  endpoints: (builder) => ({
    recording: builder.query<BaseResponse<RecordingResponse[]>, void>({
      query: () => ({
        url: "/api/home/recordings",
        method: "GET",
      }),
    }),
    audioDetail: builder.query<BaseResponse<AudioDetailValue>, string>({
      query: (recordingId) => ({
        url: "/api/home/audio-detail",
        method: "GET",
        params: { recordingId },
      }),
    }),
  }),
});

export const { useRecordingQuery, useAudioDetailQuery } = homeApi;

