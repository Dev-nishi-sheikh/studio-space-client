export type Category =
  | "Photo Studio"
  | "Film Stage"
  | "Podcast Lounge"
  | "Music Suite"
  | "Workshop";

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Studio {
  _id: string;
  title: string;
  category: Category;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
  location: string;
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName: string;
  ownerAvatar?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  featured?: boolean;
}

export interface StudioDraft {
  title: string;
  category: Category;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
  location: string;
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
}

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioCategory: Category;
  ownerEmail: string;
  ownerName: string;
  userEmail: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
  hours: number;
  subtotal: number;
  deposit: number;
  total: number;
  status: BookingStatus;
  note?: string;
  createdAt: string;
}

export interface BookingDraft {
  studioId: string;
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
  note?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  photoURL: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface Review {
  _id: string;
  studioId: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

export interface StudioQuery {
  search?: string;
  category?: string;
  maxPrice?: number;
  sort?: "recommended" | "price-asc" | "price-desc" | "newest" | "rating";
}

export interface AvailabilitySlot {
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
}
