import { apiSlice } from '../../app/apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboards: builder.query({
      query: () => '/dashboard',
    }),
  }),
});

export const { useGetDashboardsQuery } = dashboardApi;
