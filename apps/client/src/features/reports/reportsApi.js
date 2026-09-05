import { apiSlice } from '../../app/apiSlice';

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReportss: builder.query({
      query: () => '/reports',
    }),
  }),
});

export const { useGetReportssQuery } = reportsApi;
