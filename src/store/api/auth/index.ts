/**
 * Auth API Module
 * Central export point for authentication-related APIs and types
 */

export * from './authTypes';
export * from './authApi';

// Re-export hooks for convenience
export {
  useLoginMutation,
  useGoogleLoginMutation,
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useGetUserProfileQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from './authApi';
