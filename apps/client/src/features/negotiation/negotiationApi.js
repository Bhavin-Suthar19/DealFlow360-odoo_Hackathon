import { apiSlice } from '../../app/apiSlice';

export const negotiationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNegotiations: builder.query({
      query: () => '/negotiation',
    }),
  }),
});

export const { useGetNegotiationsQuery } = negotiationApi;
