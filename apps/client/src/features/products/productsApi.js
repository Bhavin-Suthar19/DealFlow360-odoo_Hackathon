import { apiSlice } from '../../app/apiSlice';

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductss: builder.query({
      query: () => '/products',
    }),
  }),
});

export const { useGetProductssQuery } = productsApi;
