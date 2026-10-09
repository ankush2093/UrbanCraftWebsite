import { Booking, Address, BookingStatus } from '@/types/marketplace';
import { ALL_SERVICES } from './servicesData';

const BOOKINGS_STORAGE_KEY = 'urban_marketplace_bookings';
const ADDRESSES_STORAGE_KEY = 'urban_marketplace_addresses';
const SELECTED_LOCATION_KEY = 'urban_marketplace_location';

export const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    name: 'Ankush Kumar',
    phone: '+91 98765 43210',
    flatHouse: 'Flat 402, Shanti Vihar Apartment',
    streetArea: 'Near PC Colony Water Tank',
    locality: 'Kankarbagh',
    city: 'Patna',
    pincode: '800020',
    landmark: 'Opposite Domino\'s Pizza',
    isDefault: true,
    type: 'Home',
  },
  {
    id: 'addr-2',
    name: 'Ankush Kumar',
    phone: '+91 98765 43210',
    flatHouse: 'Cabin 3, 2nd Floor, Corporate Tower',
    streetArea: 'Boring Road Crossing, Near AN College',
    locality: 'Boring Road',
    city: 'Patna',
    pincode: '800001',
    landmark: 'Above HDFC Bank',
    isDefault: false,
    type: 'Work',
  },
];

export const INITIAL_SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'BK-78901',
    serviceId: 'srv-ac-01',
    serviceName: 'AC Service & Deep Cleaning',
    serviceImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    categoryName: 'AC Services',
    optionId: 'opt-ac-2',
    optionName: 'Deep Foam Jet Cleaning (Recommended)',
    quantity: 1,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    timeSlot: '11:00 AM',
    address: DEFAULT_ADDRESSES[0],
    price: 699,
    discount: 100,
    taxes: 54,
    platformFee: 29,
    finalAmount: 682,
    paymentMethod: 'ONLINE',
    paymentStatus: 'PAID',
    status: 'PROFESSIONAL_ASSIGNED',
    createdAt: new Date().toISOString(),
    professional: {
      id: 'pro-1',
      name: 'Ranjeet Sharma',
      phone: '+91 98350 12345',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      rating: 4.9,
      completedJobs: 840,
      role: 'HVAC Master Technician',
    },
  },
  {
    id: 'BK-74520',
    serviceId: 'srv-clean-01',
    serviceName: 'Intense Bathroom Cleaning',
    serviceImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    categoryName: 'Home Cleaning',
    optionId: 'opt-bath-2',
    optionName: '2 Bathrooms Combo (Save ₹150)',
    quantity: 1,
    date: '2026-10-02',
    timeSlot: '02:00 PM',
    address: DEFAULT_ADDRESSES[0],
    price: 649,
    discount: 50,
    taxes: 54,
    platformFee: 29,
    finalAmount: 682,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    status: 'COMPLETED',
    createdAt: '2026-10-02T09:00:00.000Z',
    professional: {
      id: 'pro-2',
      name: 'Amitabh Kumar',
      phone: '+91 94310 98765',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 4.85,
      completedJobs: 430,
      role: 'Home Hygiene Specialist',
    },
    review: {
      rating: 5,
      comment: 'Super sparkling clean bathrooms. Removed yellow scales completely.',
      ratingsBreakdown: { overall: 5, behavior: 5, quality: 5, valueForMoney: 5 },
      createdAt: '2026-10-02T16:00:00.000Z',
    },
  },
  {
    id: 'BK-69103',
    serviceId: 'srv-elec-01',
    serviceName: 'Electrician Visit & Quick Repairs',
    serviceImage: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    categoryName: 'Electrician',
    optionId: 'opt-elec-2',
    optionName: 'Fan Installation / Replacement',
    quantity: 2,
    date: '2026-09-25',
    timeSlot: '04:00 PM',
    address: DEFAULT_ADDRESSES[1],
    price: 398,
    discount: 0,
    taxes: 36,
    platformFee: 29,
    finalAmount: 463,
    paymentMethod: 'CASH_AFTER_SERVICE',
    paymentStatus: 'REFUNDED',
    status: 'CANCELLED',
    createdAt: '2026-09-24T14:00:00.000Z',
    cancellationReason: 'Changed plans',
    cancellationDetails: 'Fan delivery from courier got delayed.',
    cancelledAt: '2026-09-25T10:00:00.000Z',
  },
];

export const getStoredBookings = (): Booking[] => {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_BOOKINGS;
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_BOOKINGS));
      return INITIAL_SAMPLE_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SAMPLE_BOOKINGS;
  }
};

export const saveBookings = (bookings: Booking[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  window.dispatchEvent(new Event('bookings_updated'));
};

export const getBookingById = (id: string): Booking | undefined => {
  const list = getStoredBookings();
  return list.find((b) => b.id.toLowerCase() === id.toLowerCase());
};

export const createNewBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking => {
  const newId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;
  const fullBooking: Booking = {
    ...bookingData,
    id: newId,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
    professional: {
      id: `pro-${Math.floor(10 + Math.random() * 90)}`,
      name: 'Sunil Paswan',
      phone: '+91 97710 54321',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      rating: 4.88,
      completedJobs: 512,
      role: 'Certified Service Partner',
    },
  };

  const list = getStoredBookings();
  const updated = [fullBooking, ...list];
  saveBookings(updated);
  return fullBooking;
};

export const updateBookingStatus = (id: string, status: BookingStatus): boolean => {
  const list = getStoredBookings();
  const idx = list.findIndex((b) => b.id.toLowerCase() === id.toLowerCase());
  if (idx === -1) return false;

  list[idx].status = status;
  saveBookings(list);
  return true;
};

export const rescheduleBooking = (id: string, newDate: string, newTimeSlot: string): boolean => {
  const list = getStoredBookings();
  const idx = list.findIndex((b) => b.id.toLowerCase() === id.toLowerCase());
  if (idx === -1) return false;

  list[idx].date = newDate;
  list[idx].timeSlot = newTimeSlot;
  list[idx].status = 'CONFIRMED';
  saveBookings(list);
  return true;
};

export const cancelBooking = (id: string, reason: string, details?: string): boolean => {
  const list = getStoredBookings();
  const idx = list.findIndex((b) => b.id.toLowerCase() === id.toLowerCase());
  if (idx === -1) return false;

  list[idx].status = 'CANCELLED';
  list[idx].cancellationReason = reason;
  list[idx].cancellationDetails = details || '';
  list[idx].cancelledAt = new Date().toISOString();
  if (list[idx].paymentStatus === 'PAID') {
    list[idx].paymentStatus = 'REFUNDED';
  }
  saveBookings(list);
  return true;
};

export const addReviewToBooking = (
  id: string,
  review: {
    rating: number;
    comment: string;
    ratingsBreakdown: { overall: number; behavior: number; quality: number; valueForMoney: number };
  }
): boolean => {
  const list = getStoredBookings();
  const idx = list.findIndex((b) => b.id.toLowerCase() === id.toLowerCase());
  if (idx === -1) return false;

  list[idx].review = {
    ...review,
    createdAt: new Date().toISOString(),
  };
  saveBookings(list);
  return true;
};

export const getStoredAddresses = (): Address[] => {
  if (typeof window === 'undefined') return DEFAULT_ADDRESSES;
  try {
    const raw = localStorage.getItem(ADDRESSES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(DEFAULT_ADDRESSES));
      return DEFAULT_ADDRESSES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ADDRESSES;
  }
};

export const saveNewAddress = (address: Omit<Address, 'id'>): Address => {
  const newAddr: Address = {
    ...address,
    id: `addr-${Date.now()}`,
  };
  const list = getStoredAddresses();
  if (newAddr.isDefault) {
    list.forEach((a) => (a.isDefault = false));
  }
  const updated = [newAddr, ...list];
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
  }
  return newAddr;
};

export const getSelectedLocation = (): string => {
  if (typeof window === 'undefined') return 'Kankarbagh, Patna';
  return localStorage.getItem(SELECTED_LOCATION_KEY) || 'Kankarbagh, Patna';
};

export const setSelectedLocation = (loc: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SELECTED_LOCATION_KEY, loc);
  window.dispatchEvent(new Event('location_updated'));
};
