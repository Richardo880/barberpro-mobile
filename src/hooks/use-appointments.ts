import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/api-client";
import Toast from "react-native-toast-message";
import type { Appointment, TimeSlot } from "@/src/types";

interface AppointmentsResponse {
  appointments: Appointment[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface SlotsResponse {
  slots: TimeSlot[];
}

interface AppointmentQueryParams {
  status?: string | string[];
  clientId?: string;
  staffId?: string;
  date?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

interface CreateAppointmentData {
  serviceId: string;
  staffId?: string | null;
  startTime: string;
  clientNotes?: string;
}

export function useAppointments(params?: AppointmentQueryParams) {
  return useQuery<AppointmentsResponse>({
    queryKey: ["appointments", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.status) {
        const statusValue = Array.isArray(params.status)
          ? params.status.join(",")
          : params.status;
        searchParams.set("status", statusValue);
      }
      if (params?.clientId) searchParams.set("clientId", params.clientId);
      if (params?.staffId) searchParams.set("staffId", params.staffId);
      if (params?.date) searchParams.set("date", params.date);
      if (params?.from) searchParams.set("from", params.from);
      if (params?.to) searchParams.set("to", params.to);
      if (params?.page) searchParams.set("page", params.page.toString());
      if (params?.limit) searchParams.set("limit", params.limit.toString());

      return apiClient<AppointmentsResponse>(
        `/api/appointments?${searchParams.toString()}`
      );
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppointmentData) => {
      return apiClient("/api/appointments", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      Toast.show({
        type: "success",
        text1: "Turno reservado",
        text2: "Tu turno ha sido reservado exitosamente",
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { status?: string; clientNotes?: string };
    }) => {
      return apiClient(`/api/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient(`/api/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "CANCELLED" }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      Toast.show({
        type: "success",
        text1: "Turno cancelado",
        text2: "El turno ha sido cancelado",
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    },
  });
}

export function useAvailableSlots(
  serviceId: string,
  date: string,
  staffId?: string,
  options?: { enabled?: boolean }
) {
  return useQuery<SlotsResponse>({
    queryKey: ["available-slots", serviceId, date, staffId],
    queryFn: async () => {
      return apiClient<SlotsResponse>("/api/appointments/available-slots", {
        method: "POST",
        body: JSON.stringify({ serviceId, staffId, date }),
        skipAuth: true,
      });
    },
    enabled: options?.enabled ?? (!!serviceId && !!date),
    staleTime: 2 * 60 * 1000,
  });
}
