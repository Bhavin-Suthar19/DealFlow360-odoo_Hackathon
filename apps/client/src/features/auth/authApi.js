import { apiSlice } from '../../app/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuths: builder.query({
      query: () => '/auth',
    }),
  }),
});

export const { useGetAuthsQuery } = authApi;
