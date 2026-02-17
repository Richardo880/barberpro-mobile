import { isPromoActive, getDiscountedPrice, PromotionConfig } from "../use-promotion";

const makeConfig = (overrides: Partial<PromotionConfig> = {}): PromotionConfig => ({
  enabled: true,
  day: new Date().getDay(), // today by default
  discount: 5000,
  message: "Promo!",
  serviceIds: ["svc-1", "svc-2"],
  ...overrides,
});

describe("isPromoActive", () => {
  it("returns false when config is undefined", () => {
    expect(isPromoActive(undefined)).toBe(false);
  });

  it("returns false when config is disabled", () => {
    expect(isPromoActive(makeConfig({ enabled: false }))).toBe(false);
  });

  it("returns false when day does not match today", () => {
    const wrongDay = (new Date().getDay() + 1) % 7;
    expect(isPromoActive(makeConfig({ day: wrongDay }))).toBe(false);
  });

  it("returns true when enabled and day matches today", () => {
    expect(isPromoActive(makeConfig())).toBe(true);
  });
});

describe("getDiscountedPrice", () => {
  it("returns original price when promo is inactive", () => {
    const result = getDiscountedPrice(20000, "svc-1", makeConfig({ enabled: false }));
    expect(result).toEqual({ finalPrice: 20000, hasDiscount: false });
  });

  it("returns original price when config is undefined", () => {
    const result = getDiscountedPrice(20000, "svc-1", undefined);
    expect(result).toEqual({ finalPrice: 20000, hasDiscount: false });
  });

  it("returns original price when service is not in promo list", () => {
    const result = getDiscountedPrice(20000, "svc-other", makeConfig());
    expect(result).toEqual({ finalPrice: 20000, hasDiscount: false });
  });

  it("applies discount when promo is active and service matches", () => {
    const result = getDiscountedPrice(20000, "svc-1", makeConfig({ discount: 5000 }));
    expect(result).toEqual({ finalPrice: 15000, hasDiscount: true });
  });

  it("clamps final price to 0 when discount exceeds price", () => {
    const result = getDiscountedPrice(3000, "svc-1", makeConfig({ discount: 5000 }));
    expect(result).toEqual({ finalPrice: 0, hasDiscount: true });
  });
});
