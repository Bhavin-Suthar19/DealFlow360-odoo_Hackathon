import { apiSlice } from '../../app/apiSlice';

export const subscriptionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionss: builder.query({
      query: () => '/subscriptions',
    }),
  }),
});

export const { useGetSubscriptionssQuery } = subscriptionsApi;
