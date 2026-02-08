import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/api-client";
import type { HaircutRecord } from "@/src/types";

interface RecordsResponse {
  records: HaircutRecord[];
}

export function useRecords() {
  return useQuery<RecordsResponse>({
    queryKey: ["records"],
    queryFn: async () => {
      return apiClient<RecordsResponse>("/api/records");
    },
  });
}
