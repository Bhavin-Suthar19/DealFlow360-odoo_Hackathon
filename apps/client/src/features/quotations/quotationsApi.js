import { apiSlice } from '../../app/apiSlice';

export const quotationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuotationss: builder.query({
      query: () => '/quotations',
    }),
  }),
});

export const { useGetQuotationssQuery } = quotationsApi;
