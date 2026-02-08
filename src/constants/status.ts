import type { AppointmentStatus } from "@/src/types";

export const statusColors: Record<AppointmentStatus, string> = {
  PENDING: "#eab308",
  CONFIRMED: "#3b82f6",
  COMPLETED: "#22c55e",
  CANCELLED: "#ef4444",
  NO_SHOW: "#6b7280",
};

export const statusBackgrounds: Record<AppointmentStatus, string> = {
  PENDING: "#fef9c3",
  CONFIRMED: "#dbeafe",
  COMPLETED: "#dcfce7",
  CANCELLED: "#fee2e2",
  NO_SHOW: "#f3f4f6",
};

export const statusLabels: Record<AppointmentStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
  NO_SHOW: "No asistió",
};
