import React, { createContext, useContext, useState, useCallback } from "react";

interface BookingState {
  serviceId: string | null;
  serviceName: string | null;
  serviceDuration: number | null;
  servicePrice: number | null;
  staffId: string | null;
  staffName: string | null;
  date: string | null;
  timeSlot: string | null;
  slotStart: string | null;
  notes: string;
}

interface BookingContextType extends BookingState {
  setService: (id: string, name: string, duration: number, price: number) => void;
  setStaff: (id: string | null, name: string | null) => void;
  setDateTime: (date: string, timeSlot: string, slotStart: string) => void;
  setNotes: (notes: string) => void;
  reset: () => void;
}

const initialState: BookingState = {
  serviceId: null,
  serviceName: null,
  serviceDuration: null,
  servicePrice: null,
  staffId: null,
  staffName: null,
  date: null,
  timeSlot: null,
  slotStart: null,
  notes: "",
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);

  const setService = useCallback(
    (id: string, name: string, duration: number, price: number) => {
      setState((prev) => ({
        ...prev,
        serviceId: id,
        serviceName: name,
        serviceDuration: duration,
        servicePrice: price,
      }));
    },
    []
  );

  const setStaff = useCallback(
    (id: string | null, name: string | null) => {
      setState((prev) => ({ ...prev, staffId: id, staffName: name }));
    },
    []
  );

  const setDateTime = useCallback(
    (date: string, timeSlot: string, slotStart: string) => {
      setState((prev) => ({ ...prev, date, timeSlot, slotStart }));
    },
    []
  );

  const setNotes = useCallback((notes: string) => {
    setState((prev) => ({ ...prev, notes }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <BookingContext.Provider
      value={{ ...state, setService, setStaff, setDateTime, setNotes, reset }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
