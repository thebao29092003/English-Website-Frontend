import { apiConfig } from "../apiConfig/apiConfig";
import type { BaseResponse } from "../types/baseResponse";

export const cloudinaryApi = apiConfig.injectEndpoints({
  endpoints: (builder) => ({
    uploadAudio: builder.mutation<BaseResponse<string>, FormData>({
      query: (formData) => ({
        url: "/api/cloudinary/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadAudioMutation } = cloudinaryApi;
