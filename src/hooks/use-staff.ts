import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/api-client";
import type { StaffMember } from "@/src/types";

interface StaffResponse {
  staff: StaffMember[];
}

export function useStaff(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;

  return useQuery<StaffResponse>({
    queryKey: ["staff"],
    queryFn: async () => {
      return apiClient<StaffResponse>("/api/staff", { skipAuth: true });
    },
    staleTime: 10 * 60 * 1000,
    enabled,
  });
}
