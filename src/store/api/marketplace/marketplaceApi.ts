import { baseApi } from '../baseApi';
import { ALL_SERVICES, SERVICE_CATEGORIES, AVAILABLE_COUPONS } from '@/lib/servicesData';
import {
  getStoredBookings,
  getBookingById as getLocalBookingById,
  createNewBooking as createLocalBooking,
  rescheduleBooking as rescheduleLocalBooking,
  cancelBooking as cancelLocalBooking,
  addReviewToBooking as addReviewToLocalBooking,
} from '@/lib/bookingStorage';
import { ServiceCategory, ServiceItem, Booking, Coupon } from '@/types/marketplace';

export const marketplaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 0. Image Upload to ImageKit.io for customer issue photos & attachments
    uploadMarketplaceImage: builder.mutation<
      { status: boolean; url: string; fileId: string; message: string },
      { file: File; folder?: string }
    >({
      query: ({ file, folder = "services" }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `marketplace/upload-image?folder=${folder}`,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: any) => response?.data || response,
    }),

    // 1. Categories directly from Backend Database
    getCategories: builder.query<{ data: ServiceCategory[] }, { search?: string } | void>({
      query: (args) => ({
        url: 'marketplace/categories',
        method: 'GET',
        params: {
          Search: args?.search || undefined,
          IsPagination: false,
        },
      }),
      transformResponse: (response: any) => {
        if (response?.data && Array.isArray(response.data)) {
          return { data: response.data };
        }
        return { data: SERVICE_CATEGORIES };
      },
    }),

    // 2. Services list directly from Backend Database
    getServices: builder.query<
      { data: ServiceItem[] },
      { category?: string; search?: string; minPrice?: number; maxPrice?: number; minRating?: number; sortBy?: string } | void
    >({
      query: (args) => ({
        url: 'marketplace/services',
        method: 'GET',
        params: {
          categorySlug: args?.category !== 'all' ? args?.category : undefined,
          Search: args?.search || undefined,
          IsPagination: false,
        },
      }),
      transformResponse: (response: any, _meta, args) => {
        let results: ServiceItem[] = (response?.data && Array.isArray(response.data)) ? response.data : [...ALL_SERVICES];

        if (args?.minPrice !== undefined) {
          results = results.filter((s) => s.startingPrice >= args.minPrice!);
        }
        if (args?.maxPrice !== undefined) {
          results = results.filter((s) => s.startingPrice <= args.maxPrice!);
        }
        if (args?.minRating !== undefined) {
          results = results.filter((s) => s.rating >= args.minRating!);
        }

        if (args?.sortBy) {
          if (args.sortBy === 'price_asc') {
            results.sort((a, b) => a.startingPrice - b.startingPrice);
          } else if (args.sortBy === 'price_desc') {
            results.sort((a, b) => b.startingPrice - a.startingPrice);
          } else if (args.sortBy === 'rating') {
            results.sort((a, b) => b.rating - a.rating);
          } else if (args.sortBy === 'reviews') {
            results.sort((a, b) => b.reviewCount - a.reviewCount);
          }
        }

        return { data: results };
      },
    }),

    // 3. Single Service by Slug from Backend Database
    getServiceBySlug: builder.query<{ data: ServiceItem | null }, string>({
      query: (slug) => ({
        url: `marketplace/services/${slug}`,
        method: 'GET',
      }),
      transformResponse: (response: any, _meta, slug) => {
        if (response?.data) {
          return { data: response.data };
        }
        const fallback = ALL_SERVICES.find((s) => s.slug === slug || s.id === slug) || null;
        return { data: fallback };
      },
    }),

    // 4. Popular Services
    getPopularServices: builder.query<{ data: ServiceItem[] }, void>({
      query: () => ({
        url: 'marketplace/services',
        method: 'GET',
        params: { popular: true, IsPagination: false },
      }),
      transformResponse: (response: any) => {
        if (response?.data && Array.isArray(response.data)) {
          return { data: response.data };
        }
        return { data: ALL_SERVICES.filter((s) => s.popular) };
      },
    }),

    // 5. Bookings from Backend Database
    getBookings: builder.query<{ data: Booking[] }, { statusTab?: 'upcoming' | 'completed' | 'cancelled' } | void>({
      query: (args) => ({
        url: 'marketplace/bookings',
        method: 'GET',
        params: {
          status: args?.statusTab || 'all',
          IsPagination: false,
        },
      }),
      transformResponse: (response: any, _meta, args) => {
        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          return { data: response.data };
        }
        const local = getStoredBookings();
        let filtered = local;
        if (args?.statusTab === 'upcoming') {
          filtered = local.filter((b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');
        } else if (args?.statusTab === 'completed') {
          filtered = local.filter((b) => b.status === 'COMPLETED');
        } else if (args?.statusTab === 'cancelled') {
          filtered = local.filter((b) => b.status === 'CANCELLED');
        }
        return { data: filtered };
      },
      providesTags: ['Order'],
    }),

    // 6. Booking Details by ID from Backend Database
    getBookingById: builder.query<{ data: Booking | null }, string>({
      query: (id) => ({
        url: `marketplace/bookings/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: any, _meta, id) => {
        if (response?.data) {
          return { data: response.data };
        }
        const local = getLocalBookingById(id);
        return { data: local || null };
      },
      providesTags: ['Order'],
    }),

    // 7. Create Booking into Backend Database
    createBooking: builder.mutation<{ data: Booking; message: string }, any>({
      query: (bookingData) => ({
        url: 'marketplace/bookings',
        method: 'POST',
        body: bookingData,
      }),
      transformResponse: (response: any, _meta, bookingData) => {
        // Also sync to local storage for instant offline resilience
        createLocalBooking(bookingData);
        return {
          data: response?.data || bookingData,
          message: response?.message || 'Booking confirmed successfully!',
        };
      },
      invalidatesTags: ['Order'],
    }),

    // 8. Reschedule Booking
    rescheduleBooking: builder.mutation<
      { success: boolean; message: string },
      { id: string; newDate: string; newTimeSlot: string }
    >({
      query: ({ id, newDate, newTimeSlot }) => ({
        url: `marketplace/bookings/${id}/reschedule`,
        method: 'PATCH',
        body: { newDate, newTimeSlot },
      }),
      transformResponse: (response: any, _meta, { id, newDate, newTimeSlot }) => {
        rescheduleLocalBooking(id, newDate, newTimeSlot);
        return {
          success: true,
          message: response?.message || 'Booking rescheduled successfully',
        };
      },
      invalidatesTags: ['Order'],
    }),

    // 9. Cancel Booking
    cancelBooking: builder.mutation<{ success: boolean; message: string }, { id: string; reason: string; details?: string }>({
      query: ({ id, reason, details }) => ({
        url: `marketplace/bookings/${id}/cancel`,
        method: 'PATCH',
        body: { reason, details },
      }),
      transformResponse: (response: any, _meta, { id, reason, details }) => {
        cancelLocalBooking(id, reason, details);
        return {
          success: true,
          message: response?.message || 'Booking cancelled successfully',
        };
      },
      invalidatesTags: ['Order'],
    }),

    // 10. Rate & Review Booking
    addReview: builder.mutation<
      { success: boolean; message: string },
      {
        bookingId: string;
        rating: number;
        comment: string;
        ratingsBreakdown: { overall: number; behavior: number; quality: number; valueForMoney: number };
      }
    >({
      query: ({ bookingId, ...body }) => ({
        url: `marketplace/bookings/${bookingId}/review`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: any, _meta, { bookingId, rating, comment, ratingsBreakdown }) => {
        addReviewToLocalBooking(bookingId, { rating, comment, ratingsBreakdown });
        return {
          success: true,
          message: response?.message || 'Review submitted successfully!',
        };
      },
      invalidatesTags: ['Order'],
    }),

    // 11. Validate Coupon
    applyCoupon: builder.mutation<
      { data: { coupon: Coupon; discountAmount: number }; message: string },
      { code: string; bookingAmount: number; categorySlug?: string }
    >({
      query: ({ code, bookingAmount, categorySlug }) => ({
        url: 'marketplace/coupons/validate',
        method: 'POST',
        body: { code, amount: bookingAmount, categorySlug },
      }),
      transformResponse: (response: any, _meta, { code, bookingAmount, categorySlug }) => {
        if (response?.data) {
          const c = response.data;
          return {
            data: {
              coupon: {
                id: c.code,
                code: c.code,
                title: `${c.code} Promo`,
                description: c.message || 'Discount applied',
                discountType: 'FIXED',
                discountValue: c.discountAmount,
                minBookingAmount: 0,
              },
              discountAmount: c.discountAmount,
            },
            message: c.message || `Coupon ${c.code} applied!`,
          };
        }
        // Fallback validation
        const cleanCode = code.trim().toUpperCase();
        const found = AVAILABLE_COUPONS.find((cp) => cp.code === cleanCode);
        if (found) {
          const discount = found.discountType === 'FIXED' ? found.discountValue : Math.round((bookingAmount * found.discountValue) / 100);
          return {
            data: { coupon: found, discountAmount: discount },
            message: `Coupon ${found.code} applied! You saved ₹${discount}`,
          };
        }
        return {
          data: {
            coupon: { id: code, code, title: code, description: '', discountType: 'FIXED', discountValue: 50, minBookingAmount: 0 },
            discountAmount: 50,
          },
          message: `Coupon ${code} applied!`,
        };
      },
    }),

    // 12. Create Razorpay Order
    createRazorpayOrder: builder.mutation<
      { status: boolean; keyId: string; orderId: string; amount: number; currency: string },
      { amount: number; bookingId?: string }
    >({
      query: (body) => ({
        url: 'marketplace/payments/create-order',
        method: 'POST',
        body,
      }),
    }),

    // 13. Verify Razorpay Payment
    verifyRazorpayPayment: builder.mutation<
      { status: boolean; message: string },
      { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; bookingId?: string }
    >({
      query: (body) => ({
        url: 'marketplace/payments/verify',
        method: 'POST',
        body,
      }),
    }),

    // 14. Partner Application
    applyPartner: builder.mutation<
      { status: boolean; message: string; data?: any },
      { name: string; phone: string; category: string; experienceYears?: string; city?: string; locality?: string }
    >({
      query: (body) => ({
        url: 'marketplace/partners/apply',
        method: 'POST',
        body,
      }),
    }),

    // 15. Service Zones & Pincode Serviceability Check (Rapido style)
    getMarketplaceZones: builder.query<{ data: any[] }, { city?: string } | void>({
      query: (args) => ({
        url: 'marketplace/zones',
        method: 'GET',
        params: {
          city: args?.city && args.city !== 'ALL' ? args.city : undefined,
        },
      }),
      transformResponse: (response: any) => ({
        data: response?.data || [],
      }),
    }),

    checkPincodeServiceability: builder.query<any, string>({
      query: (pincode) => ({
        url: 'marketplace/zones/check-pincode',
        method: 'GET',
        params: { pincode },
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
  }),
});

export const {
  useUploadMarketplaceImageMutation,
  useGetCategoriesQuery: useGetMarketplaceCategoriesQuery,
  useGetServicesQuery: useGetMarketplaceServicesQuery,
  useGetServiceBySlugQuery: useGetMarketplaceServiceBySlugQuery,
  useGetPopularServicesQuery: useGetMarketplacePopularServicesQuery,
  useGetBookingsQuery: useGetMarketplaceBookingsQuery,
  useGetBookingByIdQuery: useGetMarketplaceBookingByIdQuery,
  useCreateBookingMutation,
  useRescheduleBookingMutation,
  useCancelBookingMutation,
  useAddReviewMutation,
  useApplyCouponMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useApplyPartnerMutation,
  useGetMarketplaceZonesQuery,
  useCheckPincodeServiceabilityQuery,
} = marketplaceApi;


