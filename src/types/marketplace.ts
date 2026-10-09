export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration: string;
}

export interface ServiceReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  serviceOptionName?: string;
  ratingsBreakdown?: {
    overall: number;
    behavior: number;
    quality: number;
    valueForMoney: number;
  };
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  additionalImages?: string[];
  startingPrice: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  duration: string;
  options: ServiceOption[];
  included: string[];
  excluded: string[];
  warranty: string;
  faqs: { question: string; answer: string }[];
  reviews: ServiceReview[];
  popular?: boolean;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  serviceCount: number;
  color?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  flatHouse: string;
  streetArea: string;
  locality: string;
  city: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
  type: 'Home' | 'Work' | 'Other';
}

export interface BookingProfessional {
  id: string;
  name: string;
  phone: string;
  photo: string;
  rating: number;
  completedJobs: number;
  role: string;
}

export type BookingStatus =
  | 'CONFIRMED'
  | 'PROFESSIONAL_ASSIGNED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  categoryName: string;
  optionId: string;
  optionName: string;
  quantity: number;
  date: string;
  timeSlot: string;
  address: Address;
  price: number;
  discount: number;
  taxes: number;
  platformFee: number;
  finalAmount: number;
  paymentMethod: 'ONLINE' | 'UPI' | 'CASH_AFTER_SERVICE';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  status: BookingStatus;
  createdAt: string;
  professional?: BookingProfessional;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  cancellationReason?: string;
  cancellationDetails?: string;
  cancelledAt?: string;
  review?: {
    rating: number;
    comment: string;
    ratingsBreakdown: {
      overall: number;
      behavior: number;
      quality: number;
      valueForMoney: number;
    };
    createdAt: string;
  };
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minBookingAmount: number;
  maxDiscount?: number;
  categoryRestriction?: string;
}
