import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ServiceCard } from "../ServiceCard";
import type { Service } from "@/src/types";
import type { PromotionConfig } from "@/src/hooks/use-promotion";

const makeService = (overrides: Partial<Service> = {}): Service => ({
  id: "svc-1",
  name: "Corte Clásico",
  description: "Corte de pelo clásico",
  duration: 30,
  price: 25000,
  imageUrl: null,
  isActive: true,
  ...overrides,
});

const makePromotion = (overrides: Partial<PromotionConfig> = {}): PromotionConfig => ({
  enabled: true,
  day: new Date().getDay(),
  discount: 5000,
  message: "Promo!",
  serviceIds: ["svc-1"],
  ...overrides,
});

describe("ServiceCard", () => {
  it("renders service name and description", () => {
    const { getByText } = render(<ServiceCard service={makeService()} />);
    expect(getByText("Corte Clásico")).toBeTruthy();
    expect(getByText("Corte de pelo clásico")).toBeTruthy();
  });

  it("renders duration", () => {
    const { getByText } = render(<ServiceCard service={makeService()} />);
    expect(getByText("30 min")).toBeTruthy();
  });

  it("renders price without discount when no promotion", () => {
    const { getByText, queryByText } = render(
      <ServiceCard service={makeService({ price: 25000 })} />
    );
    expect(getByText("25,000 Gs")).toBeTruthy();
    // No strikethrough price
    expect(queryByText("25,000 Gs")).toBeTruthy();
  });

  it("renders discounted price with strikethrough when promo is active", () => {
    const service = makeService({ id: "svc-1", price: 25000 });
    const promo = makePromotion({ discount: 5000, serviceIds: ["svc-1"] });
    const { getByText } = render(
      <ServiceCard service={service} promotion={promo} />
    );
    // Original price with strikethrough
    expect(getByText("25,000 Gs")).toBeTruthy();
    // Discounted price
    expect(getByText("20,000 Gs")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ServiceCard service={makeService()} onPress={onPress} />
    );
    fireEvent.press(getByText("Corte Clásico"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders placeholder when no imageUrl", () => {
    const { getByTestId } = render(
      <ServiceCard service={makeService({ imageUrl: null })} />
    );
    // Scissors icon is rendered as placeholder
    expect(getByTestId("icon-Scissors")).toBeTruthy();
  });

  it("renders image when imageUrl is provided", () => {
    const { queryByTestId } = render(
      <ServiceCard
        service={makeService({ imageUrl: "https://example.com/img.jpg" })}
      />
    );
    // No scissors placeholder when image is present
    expect(queryByTestId("icon-Scissors")).toBeNull();
  });
});
