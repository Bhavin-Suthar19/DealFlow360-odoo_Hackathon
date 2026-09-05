import { apiSlice } from '../../app/apiSlice';

export const approvalsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApprovalss: builder.query({
      query: () => '/approvals',
    }),
  }),
});

export const { useGetApprovalssQuery } = approvalsApi;
