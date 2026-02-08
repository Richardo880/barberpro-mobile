export type Role = "CLIENT" | "STAFF" | "ADMIN";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  photoUrl: string | null;
  specialties: string[];
  isActive: boolean;
  services: Service[];
  staffProfileId: string;
}

export interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  clientNotes: string | null;
  staffNotes: string | null;
  createdAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  staff: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface TimeSlot {
  time: string;
  start: string;
  end: string;
  available: boolean;
}

export interface HaircutRecord {
  id: string;
  date: string;
  price: number;
  originalPrice: number | null;
  discountAmount: number | null;
  promotionApplied: boolean;
  notes: string | null;
  tags: string[];
  photoUrls: string[];
  service: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
  staff: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
