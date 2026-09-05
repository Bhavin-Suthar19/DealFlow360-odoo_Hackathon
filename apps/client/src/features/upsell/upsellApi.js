import { apiSlice } from '../../app/apiSlice';

export const upsellApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUpsells: builder.query({
      query: () => '/upsell',
    }),
  }),
});

export const { useGetUpsellsQuery } = upsellApi;
