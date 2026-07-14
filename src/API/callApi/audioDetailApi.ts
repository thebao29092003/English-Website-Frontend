import { apiConfig } from "../apiConfig/apiConfig";
import type { BaseResponse } from "../types/baseResponse";
import type { AudioDetailValueResponse } from "../types/audioDetail.type";

export const audioDetailApi = apiConfig.injectEndpoints({
  endpoints: (builder) => ({
    audioDetail: builder.query<BaseResponse<AudioDetailValueResponse>, string>({
      query: (recordingId) => ({
        url: "/api/home/audio-detail",
        method: "GET",
        params: { recordingId },
      }),
    }),
  }),
});

export const { useAudioDetailQuery } = audioDetailApi;
