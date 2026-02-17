import React from "react";
import { Alert } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import { AppointmentCard } from "../AppointmentCard";
import type { Appointment } from "@/src/types";

jest.spyOn(Alert, "alert");

const makeAppointment = (
  overrides: Partial<Appointment> = {}
): Appointment => ({
  id: "apt-1",
  startTime: "2025-07-15T10:00:00Z",
  endTime: "2025-07-15T10:30:00Z",
  status: "PENDING",
  clientNotes: null,
  staffNotes: null,
  createdAt: "2025-07-10T08:00:00Z",
  client: {
    id: "c1",
    name: "Juan",
    email: "juan@test.com",
    phone: null,
  },
  service: {
    id: "svc-1",
    name: "Corte Clásico",
    duration: 30,
    price: 25000,
  },
  staff: {
    id: "s1",
    name: "Carlos",
    email: "carlos@test.com",
  },
  ...overrides,
});

describe("AppointmentCard", () => {
  it("renders service name", () => {
    const { getByText } = render(
      <AppointmentCard appointment={makeAppointment()} />
    );
    expect(getByText("Corte Clásico")).toBeTruthy();
  });

  it("renders staff name", () => {
    const { getByText } = render(
      <AppointmentCard appointment={makeAppointment()} />
    );
    expect(getByText("Carlos")).toBeTruthy();
  });

  it("renders status badge with Pendiente for PENDING", () => {
    const { getByText } = render(
      <AppointmentCard appointment={makeAppointment({ status: "PENDING" })} />
    );
    expect(getByText("Pendiente")).toBeTruthy();
  });

  it("renders status badge with Completado for COMPLETED", () => {
    const { getByText } = render(
      <AppointmentCard appointment={makeAppointment({ status: "COMPLETED" })} />
    );
    expect(getByText("Completado")).toBeTruthy();
  });

  it("shows cancel button for PENDING status", () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <AppointmentCard
        appointment={makeAppointment({ status: "PENDING" })}
        onCancel={onCancel}
      />
    );
    expect(getByText("Cancelar turno")).toBeTruthy();
  });

  it("shows cancel button for CONFIRMED status", () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <AppointmentCard
        appointment={makeAppointment({ status: "CONFIRMED" })}
        onCancel={onCancel}
      />
    );
    expect(getByText("Cancelar turno")).toBeTruthy();
  });

  it("does not show cancel button for COMPLETED status", () => {
    const onCancel = jest.fn();
    const { queryByText } = render(
      <AppointmentCard
        appointment={makeAppointment({ status: "COMPLETED" })}
        onCancel={onCancel}
      />
    );
    expect(queryByText("Cancelar turno")).toBeNull();
  });

  it("does not show cancel button when no onCancel prop", () => {
    const { queryByText } = render(
      <AppointmentCard appointment={makeAppointment({ status: "PENDING" })} />
    );
    expect(queryByText("Cancelar turno")).toBeNull();
  });

  it("shows Alert.alert on cancel press", () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <AppointmentCard
        appointment={makeAppointment({ status: "PENDING" })}
        onCancel={onCancel}
      />
    );
    fireEvent.press(getByText("Cancelar turno"));
    expect(Alert.alert).toHaveBeenCalledWith(
      "Cancelar turno",
      "¿Estás seguro de que deseas cancelar este turno?",
      expect.any(Array)
    );
  });

  it("calls onCancel when confirming alert", () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <AppointmentCard
        appointment={makeAppointment({ status: "PENDING" })}
        onCancel={onCancel}
      />
    );
    fireEvent.press(getByText("Cancelar turno"));

    // Get the destructive button callback from Alert.alert call
    const alertButtons = (Alert.alert as jest.Mock).mock.calls[0][2];
    const confirmButton = alertButtons.find(
      (b: any) => b.style === "destructive"
    );
    confirmButton.onPress();

    expect(onCancel).toHaveBeenCalledWith("apt-1");
  });

  it("renders clientNotes when present", () => {
    const { getByText } = render(
      <AppointmentCard
        appointment={makeAppointment({ clientNotes: "Corte bajo por favor" })}
      />
    );
    expect(getByText("Corte bajo por favor")).toBeTruthy();
  });

  it("does not render clientNotes section when null", () => {
    const { queryByText } = render(
      <AppointmentCard
        appointment={makeAppointment({ clientNotes: null })}
      />
    );
    expect(queryByText("Corte bajo por favor")).toBeNull();
  });
});
