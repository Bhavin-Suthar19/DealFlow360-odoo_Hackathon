import { apiSlice } from '../../app/apiSlice';

export const billingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBillings: builder.query({
      query: () => '/billing',
    }),
  }),
});

export const { useGetBillingsQuery } = billingApi;
