import { apiSlice } from '../../app/apiSlice';

export const approvalChainsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApprovalChainss: builder.query({
      query: () => '/approval-chains',
    }),
  }),
});

export const { useGetApprovalChainssQuery } = approvalChainsApi;
