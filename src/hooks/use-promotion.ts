import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/api-client";

export interface PromotionConfig {
  enabled: boolean;
  day: number;
  discount: number;
  message: string;
  serviceIds: string[];
}

interface PromotionResponse {
  promotion: PromotionConfig;
}

export function usePromotion() {
  return useQuery<PromotionResponse>({
    queryKey: ["promotion"],
    queryFn: async () => {
      return apiClient<PromotionResponse>("/api/settings/promotion", {
        skipAuth: true,
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function isPromoActive(config: PromotionConfig | undefined): boolean {
  if (!config || !config.enabled) return false;
  const today = new Date().getDay();
  return today === config.day;
}

export function getDiscountedPrice(
  originalPrice: number,
  serviceId: string,
  config: PromotionConfig | undefined
): { finalPrice: number; hasDiscount: boolean } {
  if (!config || !isPromoActive(config)) {
    return { finalPrice: originalPrice, hasDiscount: false };
  }

  const hasDiscount = config.serviceIds.includes(serviceId);
  const finalPrice = hasDiscount
    ? Math.max(0, originalPrice - config.discount)
    : originalPrice;

  return { finalPrice, hasDiscount };
}
