import { apiSlice } from '../../app/apiSlice';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserss: builder.query({
      query: () => '/users',
    }),
  }),
});

export const { useGetUserssQuery } = usersApi;
