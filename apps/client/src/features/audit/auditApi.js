import { apiSlice } from '../../app/apiSlice';

export const auditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAudits: builder.query({
      query: () => '/audit',
    }),
  }),
});

export const { useGetAuditsQuery } = auditApi;
