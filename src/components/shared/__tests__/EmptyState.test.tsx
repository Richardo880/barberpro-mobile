import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { EmptyState } from "../EmptyState";
import { Search } from "lucide-react-native";

describe("EmptyState", () => {
  it("renders the title", () => {
    const { getByText } = render(<EmptyState title="Sin resultados" />);
    expect(getByText("Sin resultados")).toBeTruthy();
  });

  it("renders the description when provided", () => {
    const { getByText } = render(
      <EmptyState title="Sin resultados" description="No hay datos disponibles" />
    );
    expect(getByText("No hay datos disponibles")).toBeTruthy();
  });

  it("does not render description when not provided", () => {
    const { queryByText } = render(<EmptyState title="Sin resultados" />);
    expect(queryByText("No hay datos disponibles")).toBeNull();
  });

  it("renders the icon when provided", () => {
    const { getByTestId } = render(
      <EmptyState title="Sin resultados" icon={Search} />
    );
    expect(getByTestId("icon-Search")).toBeTruthy();
  });

  it("renders action button when both actionLabel and onAction are provided", () => {
    const onAction = jest.fn();
    const { getByText } = render(
      <EmptyState title="Sin resultados" actionLabel="Reintentar" onAction={onAction} />
    );
    const button = getByText("Reintentar");
    expect(button).toBeTruthy();
    fireEvent.press(button);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("does not render action button when only actionLabel is provided", () => {
    const { queryByText } = render(
      <EmptyState title="Sin resultados" actionLabel="Reintentar" />
    );
    expect(queryByText("Reintentar")).toBeNull();
  });

  it("does not render action button when only onAction is provided", () => {
    const { toJSON } = render(
      <EmptyState title="Sin resultados" onAction={() => {}} />
    );
    // Should render without a button
    expect(toJSON()).toBeTruthy();
  });
});
