import React, { useState, useMemo } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "lucide-react-native";
import { SegmentedControl } from "@/src/components/ui/SegmentedControl";
import { AppointmentCard } from "@/src/components/appointments/AppointmentCard";
import { LoadingSpinner } from "@/src/components/shared/LoadingSpinner";
import { EmptyState } from "@/src/components/shared/EmptyState";
import { useAppointments, useCancelAppointment } from "@/src/hooks/use-appointments";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";

export default function AppointmentsScreen() {
  const [tab, setTab] = useState(0);
  const { data, isLoading, refetch } = useAppointments({ limit: 100 });
  const cancelMutation = useCancelAppointment();
  const { theme } = useTheme();
  const colors = Colors[theme];

  const appointments = data?.appointments || [];

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const upcoming = appointments
      .filter(
        (a) =>
          (a.status === "PENDING" || a.status === "CONFIRMED") &&
          new Date(a.startTime) >= now
      )
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

    const past = appointments
      .filter(
        (a) =>
          a.status === "COMPLETED" ||
          a.status === "CANCELLED" ||
          a.status === "NO_SHOW" ||
          new Date(a.startTime) < now
      )
      .sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );

    return { upcoming, past };
  }, [appointments]);

  const displayList = tab === 0 ? upcoming : past;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 pt-6 pb-2">
        <Text className="text-2xl font-bold text-foreground">Mis Turnos</Text>
        <SegmentedControl
          segments={["Próximos", "Pasados"]}
          selectedIndex={tab}
          onChange={setTab}
          className="mt-4"
        />
      </View>

      <FlatList
        data={displayList}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 py-2"
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onCancel={(id) => cancelMutation.mutate(id)}
            cancelling={cancelMutation.isPending}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon={Calendar}
            title={tab === 0 ? "Sin turnos próximos" : "Sin turnos pasados"}
            description={
              tab === 0
                ? "Reserva tu próximo turno"
                : "Aquí aparecerán tus turnos completados"
            }
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}
