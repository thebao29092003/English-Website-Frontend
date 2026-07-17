import { apiConfig } from "../apiConfig/apiConfig";
import type { BaseResponse } from "../types/baseResponse";
import type {
  AudioDetailValueResponse,
  RecordingResponse,
} from "../types/audio.type";

export const audioDetailApi = apiConfig.injectEndpoints({
  endpoints: (builder) => ({
    audioDetail: builder.query<BaseResponse<AudioDetailValueResponse>, string>({
      query: (recordingId) => ({
        url: "/api/audio/audio-detail",
        method: "GET",
        params: { recordingId },
      }),
    }),

    recording: builder.query<BaseResponse<RecordingResponse[]>, void>({
      query: () => ({
        url: "/api/audio/recording",
        method: "GET",
      }),
    }),

    audioDelete: builder.mutation<BaseResponse<null>, string>({
      query: (recordingId) => ({
        url: "/api/audio/audio-detail",
        method: "DELETE",
        params: { recordingId },
      }),
    }),
  }),
});

export const {
  useAudioDetailQuery,
  useRecordingQuery,
  useAudioDeleteMutation,
} = audioDetailApi;
