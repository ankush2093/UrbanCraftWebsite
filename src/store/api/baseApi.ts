import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

/* =====================================================
   ENV CONFIG
===================================================== */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/* =====================================================
   AUTH TOKEN HELPER
===================================================== */

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

/* =====================================================
   BASE QUERY
===================================================== */

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "omit",
  prepareHeaders: (headers, { endpoint }) => {
    const token = getAuthToken();

    const skipAuth = ["login", "googleLogin", "signup", "register", "verifyEmail", "getBooks", "createContact"];

    if (token && !skipAuth.includes(endpoint)) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    if (endpoint !== "uploadProfilePicture") {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },

});

/* =====================================================
   BASE QUERY WITH GLOBAL HANDLING
===================================================== */

const baseQueryWithAuthHandler: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // 🔐 Global 401 handling - but skip for login/signup/auth endpoints
  if (result.error?.status === 401) {
    // Get the URL from args to check if it's an auth endpoint
    const url = typeof args === 'string' ? args : args.url;
    const isAuthEndpoint = url?.includes('/auth/login') ||
      url?.includes('/auth/google-user') ||
      url?.includes('/auth/google') ||
      url?.includes('/auth/signup') ||
      url?.includes('/auth/register') ||
      url?.includes('/auth/verify-email');

    // Only redirect if it's NOT an auth endpoint (i.e., it's a protected route that lost auth)
    if (!isAuthEndpoint && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");

      // Redirect to login only if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }

  return result; // 👈 VERY IMPORTANT (no wrapping)
};

/* =====================================================
   BASE API
===================================================== */

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthHandler,
  tagTypes: ["User", "Auth", "Product", "Order", "ProfileNote", "ChatNote", "Appointment", "DoctorFeedback", "AppointmentGoal", "MyProfile", "ChatCounter"],
  endpoints: () => ({}),
});

/* =====================================================
   ERROR UTILITIES (COMPONENT USE)
===================================================== */

export const getErrorMessage = (error: any): string => {
  if (!error) return "Something went wrong";

  if (error.data?.message) return error.data.message;
  if (error.data?.error) return error.data.error;
  if (error.error) return error.error;
  if (error.message) return error.message;

  return "Something went wrong";
};
