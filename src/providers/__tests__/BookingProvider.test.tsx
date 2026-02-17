import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { BookingProvider, useBooking } from "../BookingProvider";

function wrapper({ children }: { children: React.ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>;
}

describe("BookingProvider", () => {
  it("throws when used outside provider", () => {
    expect(() => {
      renderHook(() => useBooking());
    }).toThrow("useBooking must be used within a BookingProvider");
  });

  it("has correct initial state", () => {
    const { result } = renderHook(() => useBooking(), { wrapper });
    expect(result.current.serviceId).toBeNull();
    expect(result.current.serviceName).toBeNull();
    expect(result.current.staffId).toBeNull();
    expect(result.current.date).toBeNull();
    expect(result.current.notes).toBe("");
  });

  it("setService updates service fields", () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.setService("svc-1", "Corte", 30, 25000);
    });

    expect(result.current.serviceId).toBe("svc-1");
    expect(result.current.serviceName).toBe("Corte");
    expect(result.current.serviceDuration).toBe(30);
    expect(result.current.servicePrice).toBe(25000);
  });

  it("setStaff updates staff fields", () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.setStaff("staff-1", "Carlos");
    });

    expect(result.current.staffId).toBe("staff-1");
    expect(result.current.staffName).toBe("Carlos");
  });

  it("setDateTime updates date, timeSlot, and slotStart", () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.setDateTime("2025-07-15", "10:00", "2025-07-15T10:00:00Z");
    });

    expect(result.current.date).toBe("2025-07-15");
    expect(result.current.timeSlot).toBe("10:00");
    expect(result.current.slotStart).toBe("2025-07-15T10:00:00Z");
  });

  it("setNotes updates notes", () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.setNotes("Corte bajo");
    });

    expect(result.current.notes).toBe("Corte bajo");
  });

  it("reset clears all state", () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.setService("svc-1", "Corte", 30, 25000);
      result.current.setStaff("staff-1", "Carlos");
      result.current.setNotes("Notes");
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.serviceId).toBeNull();
    expect(result.current.staffId).toBeNull();
    expect(result.current.notes).toBe("");
  });

  it("setting one field does not affect others", () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.setService("svc-1", "Corte", 30, 25000);
    });

    act(() => {
      result.current.setStaff("staff-1", "Carlos");
    });

    // Service should still be set
    expect(result.current.serviceId).toBe("svc-1");
    expect(result.current.staffId).toBe("staff-1");
  });
});
