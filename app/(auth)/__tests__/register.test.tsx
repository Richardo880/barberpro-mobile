import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Toast from "react-native-toast-message";
import RegisterScreen from "../register";

const mockRegister = jest.fn();

jest.mock("@/src/providers/AuthProvider", () => ({
  useAuth: () => ({
    register: mockRegister,
    user: null,
    isLoading: false,
    isAuthenticated: false,
  }),
}));

function fillForm(
  getByPlaceholderText: any,
  {
    name = "Juan Perez",
    email = "juan@test.com",
    phone = "",
    password = "Password1",
    confirm = "Password1",
  } = {}
) {
  fireEvent.changeText(getByPlaceholderText("Tu nombre completo"), name);
  fireEvent.changeText(getByPlaceholderText("tu@email.com"), email);
  if (phone) {
    fireEvent.changeText(getByPlaceholderText("+595 981 123 456"), phone);
  }
  fireEvent.changeText(getByPlaceholderText("Mínimo 8 caracteres"), password);
  fireEvent.changeText(getByPlaceholderText("Repetir contraseña"), confirm);
}

/** The "Crear Cuenta" text appears as both heading and button.
 *  The button is the last match. */
function pressSubmit(getAllByText: any) {
  const matches = getAllByText("Crear Cuenta");
  fireEvent.press(matches[matches.length - 1]);
}

describe("RegisterScreen", () => {
  it("renders all input fields", () => {
    const { getByPlaceholderText, getAllByText } = render(<RegisterScreen />);
    expect(getByPlaceholderText("Tu nombre completo")).toBeTruthy();
    expect(getByPlaceholderText("tu@email.com")).toBeTruthy();
    expect(getByPlaceholderText("+595 981 123 456")).toBeTruthy();
    expect(getByPlaceholderText("Mínimo 8 caracteres")).toBeTruthy();
    expect(getByPlaceholderText("Repetir contraseña")).toBeTruthy();
    expect(getAllByText("Crear Cuenta").length).toBeGreaterThanOrEqual(1);
  });

  it("shows error toast for empty required fields", () => {
    const { getAllByText } = render(<RegisterScreen />);
    pressSubmit(getAllByText);
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text2: "Completa los campos requeridos",
      })
    );
  });

  it("shows error toast when passwords don't match", () => {
    const { getByPlaceholderText, getAllByText } = render(<RegisterScreen />);
    fillForm(getByPlaceholderText, {
      password: "Password1",
      confirm: "DifferentPass1",
    });
    pressSubmit(getAllByText);
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text2: "Las contraseñas no coinciden",
      })
    );
  });

  it("shows error toast when password is too short", () => {
    const { getByPlaceholderText, getAllByText } = render(<RegisterScreen />);
    fillForm(getByPlaceholderText, { password: "Pa1", confirm: "Pa1" });
    pressSubmit(getAllByText);
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text2: "La contraseña debe tener 8+ caracteres, una mayúscula y un número",
      })
    );
  });

  it("shows error toast when password has no uppercase", () => {
    const { getByPlaceholderText, getAllByText } = render(<RegisterScreen />);
    fillForm(getByPlaceholderText, {
      password: "password1",
      confirm: "password1",
    });
    pressSubmit(getAllByText);
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text2: "La contraseña debe tener 8+ caracteres, una mayúscula y un número",
      })
    );
  });

  it("shows error toast when password has no digit", () => {
    const { getByPlaceholderText, getAllByText } = render(<RegisterScreen />);
    fillForm(getByPlaceholderText, {
      password: "Passwordd",
      confirm: "Passwordd",
    });
    pressSubmit(getAllByText);
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text2: "La contraseña debe tener 8+ caracteres, una mayúscula y un número",
      })
    );
  });

  it("calls register on valid form submission", async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    const { getByPlaceholderText, getAllByText } = render(<RegisterScreen />);
    fillForm(getByPlaceholderText);
    pressSubmit(getAllByText);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: "Juan Perez",
        email: "juan@test.com",
        password: "Password1",
        phone: undefined,
      });
    });
  });

  it("includes phone when provided", async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    const { getByPlaceholderText, getAllByText } = render(<RegisterScreen />);
    fillForm(getByPlaceholderText, { phone: "0981123456" });
    pressSubmit(getAllByText);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        expect.objectContaining({ phone: "0981123456" })
      );
    });
  });

  it("shows error toast on failed registration", async () => {
    mockRegister.mockRejectedValueOnce(new Error("Email ya registrado"));
    const { getByPlaceholderText, getAllByText } = render(<RegisterScreen />);
    fillForm(getByPlaceholderText);
    pressSubmit(getAllByText);

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          text1: "Error al registrarse",
          text2: "Email ya registrado",
        })
      );
    });
  });
});
