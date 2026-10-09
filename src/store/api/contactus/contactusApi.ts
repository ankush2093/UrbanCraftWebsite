import { baseApi } from '../baseApi';
import { ContactUsRequest, ContactUsResponse } from './contactusTypes';

export const contactusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation<ContactUsResponse, ContactUsRequest>({
      query: (data) => ({
        url: '/contact',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useCreateContactMutation } = contactusApi;
