import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }), 
  reducerPath: 'adminApi',
  tagTypes: ['Properties', 'Clients', 'Transactions', 'Sales','Reviews'],

  endpoints: (build) => ({
    // Property endpoints
    getProperties: build.query({
      query: () => '/properties',
      providesTags: ['Properties'],
    }),
    allProperties: build.query({
      query: () => '/properties/all',
      providesTags: ['Properties'],
    }),
    updateProperty: build.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/properties/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['Properties'],
    }),
    deleteProperty: build.mutation({
      query: (id) => ({
        url: `/properties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Properties'],
    }),

    // Client endpoints
    getClients: build.query({
      query: (id) => '/clients',
      providesTags: ["Clients"], 
    }),

      updateClient: build.mutation({
        query: ({ id, ...updateData }) => ({
          url: `/clients/${id}`,
          method: 'PUT',
          body: updateData,
        }),
        invalidatesTags: ['Clients'],
      }),
  
  
      deleteClient: build.mutation({
        query: (id) => ({
          url: `/clients/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Clients'],
      }),
      
      //Transactions / Bookings
      getTransactions: build.query({
        query: (id) => '/transactions',
        providesTags: ["Transactions"]
      }),

      //Sales
      getSales: build.query({
        query: () => '/transactions/sales',
        providesTags: ["Sales"]
      }),

      getReviews: build.query({
        query: () => "/reviews",
        providesTags: ["Reviews"]
      })
  }),
});

export const { 
  useGetPropertiesQuery,
  useAllPropertiesQuery,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetClientsQuery, 
  useCreateClientMutation,
  useUpdateClientMutation, 
  useDeleteClientMutation,
  useGetTransactionsQuery,
  useGetSalesQuery,
  useGetReviewsQuery
} = api;