import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Input } from "../Input";

describe("Input", () => {
  it("renders the label", () => {
    const { getByText } = render(<Input label="Email" />);
    expect(getByText("Email")).toBeTruthy();
  });

  it("does not render label when not provided", () => {
    const { queryByText } = render(<Input placeholder="test" />);
    expect(queryByText("Email")).toBeNull();
  });

  it("displays error message", () => {
    const { getByText } = render(<Input error="Campo requerido" />);
    expect(getByText("Campo requerido")).toBeTruthy();
  });

  it("has secureTextEntry when isPassword and not toggled", () => {
    const { getByPlaceholderText } = render(
      <Input isPassword placeholder="Password" />
    );
    const input = getByPlaceholderText("Password");
    expect(input.props.secureTextEntry).toBe(true);
  });

  it("toggles password visibility on eye icon press", () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input isPassword placeholder="Password" />
    );

    // Initially secure
    expect(getByPlaceholderText("Password").props.secureTextEntry).toBe(true);

    // Press the eye icon to toggle
    fireEvent.press(getByTestId("icon-Eye"));

    // Now should be visible
    expect(getByPlaceholderText("Password").props.secureTextEntry).toBe(false);
  });

  it("calls onChangeText", () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Type here" onChangeText={onChangeText} />
    );
    fireEvent.changeText(getByPlaceholderText("Type here"), "hello");
    expect(onChangeText).toHaveBeenCalledWith("hello");
  });
});
