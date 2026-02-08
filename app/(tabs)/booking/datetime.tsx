import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Calendar as RNCalendar } from "react-native-calendars";
import { format } from "date-fns";
import { ProgressBar } from "@/src/components/ui/ProgressBar";
import { Button } from "@/src/components/ui/Button";
import { LoadingSpinner } from "@/src/components/shared/LoadingSpinner";
import { useAvailableSlots } from "@/src/hooks/use-appointments";
import { useBooking } from "@/src/providers/BookingProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";

export default function BookingStep3() {
  const { serviceId, staffId, timeSlot, setDateTime } = useBooking();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(timeSlot);
  const [selectedSlotStart, setSelectedSlotStart] = useState<string | null>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const colors = Colors[theme];

  const today = format(new Date(), "yyyy-MM-dd");

  const { data: slotsData, isLoading: loadingSlots } = useAvailableSlots(
    serviceId || "",
    selectedDate,
    staffId || undefined,
    { enabled: !!serviceId && !!selectedDate }
  );

  const slots = slotsData?.slots || [];

  const handleDateSelect = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setSelectedSlot(null);
    setSelectedSlotStart(null);
  };

  const handleSlotSelect = (slot: { time: string; start: string; available: boolean }) => {
    if (!slot.available) return;
    setSelectedSlot(slot.time);
    setSelectedSlotStart(slot.start);
  };

  const handleNext = () => {
    if (!selectedDate || !selectedSlot || !selectedSlotStart) return;
    setDateTime(selectedDate, selectedSlot, selectedSlotStart);
    router.push("/(tabs)/booking/confirm");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 py-4" nestedScrollEnabled keyboardShouldPersistTaps="handled">
        <ProgressBar progress={75} className="mb-4" />
        <Text className="text-xl font-bold text-foreground">
          Paso 3: Fecha y hora
        </Text>
        <Text className="mt-1 mb-4 text-sm text-muted-foreground">
          Seleccioná el día y horario
        </Text>

        <RNCalendar
          onDayPress={handleDateSelect}
          markedDates={
            selectedDate
              ? {
                  [selectedDate]: {
                    selected: true,
                    selectedColor: colors.primary,
                  },
                }
              : {}
          }
          minDate={today}
          enableSwipeMonths={false}
          theme={{
            backgroundColor: colors.background,
            calendarBackground: colors.card,
            textSectionTitleColor: colors.mutedForeground,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: colors.primaryForeground,
            todayTextColor: colors.primary,
            dayTextColor: colors.foreground,
            textDisabledColor: colors.mutedForeground,
            arrowColor: colors.primary,
            monthTextColor: colors.foreground,
          }}
          style={{ borderRadius: 12, borderWidth: 1, borderColor: colors.border }}
        />

        {selectedDate && (
          <View className="mt-6">
            <Text className="mb-3 text-base font-semibold text-foreground">
              Horarios disponibles
            </Text>
            {loadingSlots ? (
              <LoadingSpinner size="small" className="py-8" />
            ) : slots.length === 0 ? (
              <Text className="py-8 text-center text-muted-foreground">
                No hay horarios disponibles para esta fecha
              </Text>
            ) : (
              <View className="flex-row flex-wrap gap-2">
                {slots.map((slot) => (
                  <Pressable
                    key={slot.time}
                    className={`rounded-lg border px-4 py-2 ${
                      !slot.available
                        ? "border-muted bg-muted opacity-40"
                        : selectedSlot === slot.time
                          ? "border-primary bg-primary"
                          : "border-border"
                    }`}
                    onPress={() => handleSlotSelect(slot)}
                    disabled={!slot.available}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedSlot === slot.time
                          ? "text-primary-foreground"
                          : slot.available
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {slot.time}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}

        <View className="mt-6 mb-8 flex-row gap-3">
          <Button variant="outline" className="flex-1" onPress={() => router.back()}>
            Volver
          </Button>
          <Button
            className="flex-1"
            onPress={handleNext}
            disabled={!selectedSlot}
          >
            Siguiente
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
