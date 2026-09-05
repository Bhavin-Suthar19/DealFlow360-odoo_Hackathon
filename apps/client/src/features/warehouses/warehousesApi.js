import { apiSlice } from '../../app/apiSlice';

export const warehousesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWarehousess: builder.query({
      query: () => '/warehouses',
    }),
  }),
});

export const { useGetWarehousessQuery } = warehousesApi;
