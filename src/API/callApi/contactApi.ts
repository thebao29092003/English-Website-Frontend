import { apiConfigNoHeader } from "../apiConfig/apiConfigNoHeader";
import type { BaseResponse } from "../types/baseResponse";
import type { CreateContactRequest } from "../types/contact.type";

export const contactApi = apiConfigNoHeader.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation<BaseResponse<null>, CreateContactRequest>({
      query: (body) => ({
        url: "/api/contact",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateContactMutation } = contactApi;
