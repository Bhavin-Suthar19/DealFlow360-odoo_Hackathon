import { apiSlice } from '../../app/apiSlice';

export const priceListsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPriceListss: builder.query({
      query: () => '/price-lists',
    }),
  }),
});

export const { useGetPriceListssQuery } = priceListsApi;
