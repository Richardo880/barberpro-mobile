import {
  isPromoActive,
  isPromoDayForDate,
  getDiscountedPrice,
  PromotionConfig,
} from "../use-promotion";

const makeConfig = (overrides: Partial<PromotionConfig> = {}): PromotionConfig => ({
  enabled: true,
  day: new Date().getDay(), // today by default
  discount: 5000,
  message: "Promo!",
  serviceIds: ["svc-1", "svc-2"],
  ...overrides,
});

// Wednesday promotion config (day 3 = Wednesday)
const wednesdayPromo: PromotionConfig = {
  enabled: true,
  day: 3, // Wednesday
  discount: 10000,
  message: "Miércoles de descuento",
  serviceIds: ["svc-1", "svc-2"],
};

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

  it("returns true on a mocked Wednesday", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 2, 4, 10, 0, 0)); // March 4, 2026 = Wednesday
    expect(isPromoActive(wednesdayPromo)).toBe(true);
    jest.useRealTimers();
  });

  it("returns false on a mocked Thursday", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 2, 5, 10, 0, 0)); // Thursday
    expect(isPromoActive(wednesdayPromo)).toBe(false);
    jest.useRealTimers();
  });
});

describe("isPromoDayForDate", () => {
  it("returns false when config is undefined", () => {
    expect(isPromoDayForDate(undefined, new Date())).toBe(false);
  });

  it("returns false when promotion is disabled", () => {
    const disabled = { ...wednesdayPromo, enabled: false };
    expect(isPromoDayForDate(disabled, new Date())).toBe(false);
  });

  it("correctly identifies Wednesday with a Date object", () => {
    const wednesday = new Date(2026, 2, 4, 10, 0, 0); // local Wednesday
    expect(isPromoDayForDate(wednesdayPromo, wednesday)).toBe(true);
  });

  it("returns false for non-Wednesday Date object", () => {
    const thursday = new Date(2026, 2, 5, 10, 0, 0);
    expect(isPromoDayForDate(wednesdayPromo, thursday)).toBe(false);
  });

  // KEY TEST: This is the timezone bug that was fixed.
  // new Date("2026-03-04") is parsed as UTC midnight, which in UTC-3 (Paraguay)
  // becomes March 3 21:00 local → getDay() returns Tuesday instead of Wednesday.
  // The fix: when a string is passed, append "T00:00:00" to force local parsing.
  it("correctly identifies Wednesday from a YYYY-MM-DD string (timezone bug fix)", () => {
    expect(isPromoDayForDate(wednesdayPromo, "2026-03-04")).toBe(true);
  });

  it("returns false for non-Wednesday date string", () => {
    expect(isPromoDayForDate(wednesdayPromo, "2026-03-05")).toBe(false); // Thursday
  });

  it("correctly handles all days of the week as strings", () => {
    // Week of March 1-7, 2026: Sun=1, Mon=2, Tue=3, Wed=4, Thu=5, Fri=6, Sat=7
    const days = [
      { date: "2026-03-01", day: 0 }, // Sunday
      { date: "2026-03-02", day: 1 }, // Monday
      { date: "2026-03-03", day: 2 }, // Tuesday
      { date: "2026-03-04", day: 3 }, // Wednesday
      { date: "2026-03-05", day: 4 }, // Thursday
      { date: "2026-03-06", day: 5 }, // Friday
      { date: "2026-03-07", day: 6 }, // Saturday
    ];

    for (const { date, day } of days) {
      const config: PromotionConfig = { ...wednesdayPromo, day };
      expect(isPromoDayForDate(config, date)).toBe(true);
    }
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

  // Booking scenario tests with date strings (simulating the booking wizard flow)
  describe("booking scenarios with date strings", () => {
    it("applies discount when booking on a Wednesday (string date)", () => {
      const result = getDiscountedPrice(50000, "svc-1", wednesdayPromo, "2026-03-04");
      expect(result).toEqual({ finalPrice: 40000, hasDiscount: true });
    });

    it("no discount when booking on a Thursday (string date)", () => {
      const result = getDiscountedPrice(50000, "svc-1", wednesdayPromo, "2026-03-05");
      expect(result).toEqual({ finalPrice: 50000, hasDiscount: false });
    });

    it("no discount for non-eligible service even on Wednesday", () => {
      const result = getDiscountedPrice(50000, "svc-99", wednesdayPromo, "2026-03-04");
      expect(result).toEqual({ finalPrice: 50000, hasDiscount: false });
    });

    it("applies discount for all eligible services on promo day", () => {
      const r1 = getDiscountedPrice(50000, "svc-1", wednesdayPromo, "2026-03-04");
      const r2 = getDiscountedPrice(30000, "svc-2", wednesdayPromo, "2026-03-04");
      expect(r1.hasDiscount).toBe(true);
      expect(r2.hasDiscount).toBe(true);
      expect(r1.finalPrice).toBe(40000);
      expect(r2.finalPrice).toBe(20000);
    });

    it("works with Date objects too (backward compat)", () => {
      const wednesday = new Date(2026, 2, 4, 10, 0, 0);
      const result = getDiscountedPrice(50000, "svc-1", wednesdayPromo, wednesday);
      expect(result).toEqual({ finalPrice: 40000, hasDiscount: true });
    });

    it("uses today check when no date provided (Wednesday)", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 4, 10, 0, 0)); // Wednesday
      const result = getDiscountedPrice(50000, "svc-1", wednesdayPromo);
      expect(result).toEqual({ finalPrice: 40000, hasDiscount: true });
      jest.useRealTimers();
    });

    it("uses today check when no date provided (non-promo day)", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 5, 10, 0, 0)); // Thursday
      const result = getDiscountedPrice(50000, "svc-1", wednesdayPromo);
      expect(result).toEqual({ finalPrice: 50000, hasDiscount: false });
      jest.useRealTimers();
    });

    it("no discount when promotion disabled even on correct day", () => {
      const disabled = { ...wednesdayPromo, enabled: false };
      const result = getDiscountedPrice(50000, "svc-1", disabled, "2026-03-04");
      expect(result).toEqual({ finalPrice: 50000, hasDiscount: false });
    });
  });
});
