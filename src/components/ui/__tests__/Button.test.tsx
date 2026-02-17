import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "../Button";

describe("Button", () => {
  it("renders text children", () => {
    const { getByText } = render(<Button>Press me</Button>);
    expect(getByText("Press me")).toBeTruthy();
  });

  it("shows ActivityIndicator when loading", () => {
    const { UNSAFE_getByType } = render(<Button loading>Press me</Button>);
    const { ActivityIndicator } = require("react-native");
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it("does not show text when loading", () => {
    const { queryByText } = render(<Button loading>Press me</Button>);
    expect(queryByText("Press me")).toBeNull();
  });

  it("disables pressable when disabled", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button disabled onPress={onPress}>
        Press me
      </Button>
    );
    fireEvent.press(getByText("Press me"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("fires onPress handler", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Press me</Button>);
    fireEvent.press(getByText("Press me"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("disables when loading is true (cannot press)", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button loading onPress={onPress} accessibilityRole="button">
        Press me
      </Button>
    );
    fireEvent.press(getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });
});
