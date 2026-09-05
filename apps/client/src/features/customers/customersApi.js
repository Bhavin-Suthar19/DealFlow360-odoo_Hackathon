import { apiSlice } from '../../app/apiSlice';

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerss: builder.query({
      query: () => '/customers',
    }),
  }),
});

export const { useGetCustomerssQuery } = customersApi;
