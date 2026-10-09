import { baseApi } from '../baseApi';

export const adminMarketplaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query<any, void>({
      query: () => ({
        url: 'admin/marketplace/analytics',
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

    getAdminCategories: builder.query<any, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: 'admin/marketplace/categories',
        method: 'GET',
        params: params || {},
      }),
    }),

    createAdminCategory: builder.mutation<any, any>({
      query: (body) => ({
        url: 'admin/marketplace/categories',
        method: 'POST',
        body,
      }),
    }),

    updateAdminCategory: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `admin/marketplace/categories/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),

    deleteAdminCategory: builder.mutation<any, number>({
      query: (id) => ({
        url: `admin/marketplace/categories/${id}`,
        method: 'DELETE',
      }),
    }),

    getAdminServices: builder.query<any, { page?: number; limit?: number; search?: string; categorySlug?: string } | void>({
      query: (params) => ({
        url: 'admin/marketplace/services',
        method: 'GET',
        params: params || {},
      }),
    }),

    createAdminService: builder.mutation<any, any>({
      query: (body) => ({
        url: 'admin/marketplace/services',
        method: 'POST',
        body,
      }),
    }),

    updateAdminService: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `admin/marketplace/services/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),

    deleteAdminService: builder.mutation<any, number>({
      query: (id) => ({
        url: `admin/marketplace/services/${id}`,
        method: 'DELETE',
      }),
    }),

    getAdminBookings: builder.query<any, { page?: number; limit?: number; search?: string; status?: string } | void>({
      query: (params) => ({
        url: 'admin/marketplace/bookings',
        method: 'GET',
        params: params || {},
      }),
      providesTags: ['Order'],
    }),

    updateAdminBookingStatus: builder.mutation<any, { id: string; status: string; professional?: any }>({
      query: ({ id, ...body }) => ({
        url: `admin/marketplace/bookings/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Order'],
    }),

    getAdminCoupons: builder.query<any, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: 'admin/marketplace/coupons',
        method: 'GET',
        params: params || {},
      }),
    }),

    createAdminCoupon: builder.mutation<any, any>({
      query: (body) => ({
        url: 'admin/marketplace/coupons',
        method: 'POST',
        body,
      }),
    }),

    deleteAdminCoupon: builder.mutation<any, number>({
      query: (id) => ({
        url: `admin/marketplace/coupons/${id}`,
        method: 'DELETE',
      }),
    }),

    getAdminPartners: builder.query<any, { page?: number; limit?: number; search?: string; status?: string } | void>({
      query: (params) => ({
        url: 'admin/marketplace/partners',
        method: 'GET',
        params: params || {},
      }),
    }),

    updateAdminPartnerStatus: builder.mutation<any, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `admin/marketplace/partners/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
    }),
  }),
});

export const {
  useGetAdminAnalyticsQuery,
  useGetAdminCategoriesQuery,
  useCreateAdminCategoryMutation,
  useUpdateAdminCategoryMutation,
  useDeleteAdminCategoryMutation,
  useGetAdminServicesQuery,
  useCreateAdminServiceMutation,
  useUpdateAdminServiceMutation,
  useDeleteAdminServiceMutation,
  useGetAdminBookingsQuery,
  useUpdateAdminBookingStatusMutation,
  useGetAdminCouponsQuery,
  useCreateAdminCouponMutation,
  useDeleteAdminCouponMutation,
  useGetAdminPartnersQuery,
  useUpdateAdminPartnerStatusMutation,
} = adminMarketplaceApi;
