import { apiSlice } from '../../app/apiSlice';

export const discountTiersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDiscountTierss: builder.query({
      query: () => '/discount-tiers',
    }),
  }),
});

export const { useGetDiscountTierssQuery } = discountTiersApi;
