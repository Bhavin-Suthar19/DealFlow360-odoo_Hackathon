import { apiSlice } from '../../app/apiSlice';

export const fulfillmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFulfillments: builder.query({
      query: () => '/fulfillment',
    }),
  }),
});

export const { useGetFulfillmentsQuery } = fulfillmentApi;
