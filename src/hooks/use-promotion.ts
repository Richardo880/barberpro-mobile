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

export function isPromoDayForDate(
  config: PromotionConfig | undefined,
  date: Date | string
): boolean {
  if (!config || !config.enabled) return false;
  const dayOfWeek =
    typeof date === "string"
      ? new Date(date + "T00:00:00").getDay()
      : date.getDay();
  return dayOfWeek === config.day;
}

export function getDiscountedPrice(
  originalPrice: number,
  serviceId: string,
  config: PromotionConfig | undefined,
  date?: Date | string
): { finalPrice: number; hasDiscount: boolean } {
  const isActive = date
    ? isPromoDayForDate(config, date)
    : isPromoActive(config);

  if (!config || !isActive) {
    return { finalPrice: originalPrice, hasDiscount: false };
  }

  const hasDiscount = config.serviceIds.includes(serviceId);
  const finalPrice = hasDiscount
    ? Math.max(0, originalPrice - config.discount)
    : originalPrice;

  return { finalPrice, hasDiscount };
}
