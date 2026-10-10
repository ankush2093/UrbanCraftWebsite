/**
 * Authentication API Types
 * All types related to authentication endpoints
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  credential: string;
}

export interface LoginResponse {
  code?: number;
  status: boolean;
  message: string;
  data: {
    AccessToken?: string;
  };
}

export interface GoogleLoginResponse {
  code?: number;
  status: boolean;
  message: string;
  data: {
    AccessToken?: string;
    User?: {
      Email?: string;
      FullName?: string;
      Role?: string;
    };
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  gender?: string;
  userType?: string;
  dateOfBirth?: string;
}

export interface RegisterResponse {
  message: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface UserProfile {
  id?: number | string;
  userId?: number | string; 
  UserId?: number | string; 
  name?: string;
  Name?: string;
  fullName?: string;
  FullName?: string;
  email?: string; 
  Email?: string; 
  phoneNumber?: string;
  PhoneNumber?: string;
  roleId?: number | string;
  RoleId?: number | string;
  createdAt?: string;
  CreatedAt?: string;
  updatedAt?: string;
  UpdatedAt?: string;
  isEmailVerified?: boolean;
  IsEmailVerified?: boolean;
  gender?: string;
  Gender?: string;
  category?: string;
  Category?: string;
  profilePicture?: string;
  ProfilePicture?: string;
  purchases?: any[];
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  status: boolean;
  message: string;
  data: any[];
}

export interface UpdateProfileRequest {
  fullName?: string;
  gender?: string;
  category?: string;
  password?: string;
}

export interface UpdateProfileResponse {
  message: string;
  data: {
    FullName: string;
    Gender: string;
    Category: string;
  };
}

export interface UploadProfilePictureResponse {
  message: string;
  data: {
    ProfilePicture: string;
  };
}
