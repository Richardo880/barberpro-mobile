import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Toast from "react-native-toast-message";
import LoginScreen from "../login";

const mockLogin = jest.fn();

jest.mock("@/src/providers/AuthProvider", () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    isLoading: false,
    isAuthenticated: false,
  }),
}));

describe("LoginScreen", () => {
  it("renders email and password inputs", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText("tu@email.com")).toBeTruthy();
    expect(getByPlaceholderText("Tu contraseña")).toBeTruthy();
  });

  it("renders login button", () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText("Iniciar Sesión")).toBeTruthy();
  });

  it("shows error toast on empty fields", () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText("Iniciar Sesión"));
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text2: "Completa todos los campos",
      })
    );
  });

  it("calls login with trimmed email", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("tu@email.com"), "  test@test.com  ");
    fireEvent.changeText(getByPlaceholderText("Tu contraseña"), "password123");
    fireEvent.press(getByText("Iniciar Sesión"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@test.com", "password123");
    });
  });

  it("shows error toast on failed login", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Credenciales inválidas"));
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("tu@email.com"), "test@test.com");
    fireEvent.changeText(getByPlaceholderText("Tu contraseña"), "wrongpass");
    fireEvent.press(getByText("Iniciar Sesión"));

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          text1: "Error al iniciar sesión",
          text2: "Credenciales inválidas",
        })
      );
    });
  });
});
