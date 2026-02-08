import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/api-client";
import type { Service } from "@/src/types";

interface ServicesResponse {
  services: Service[];
}

interface UseServicesOptions {
  active?: boolean;
  enabled?: boolean;
}

export function useServices(options: UseServicesOptions = {}) {
  const { active = true, enabled = true } = options;

  return useQuery<ServicesResponse>({
    queryKey: ["services", { active }],
    queryFn: async () => {
      return apiClient<ServicesResponse>(
        `/api/services?active=${active.toString()}`,
        { skipAuth: true }
      );
    },
    staleTime: 10 * 60 * 1000,
    enabled,
  });
}
