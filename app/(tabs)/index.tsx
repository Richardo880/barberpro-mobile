import React from "react";
import { View, Text, ScrollView, RefreshControl, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Calendar, Clock, Scissors, Plus } from "lucide-react-native";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { AppointmentCard } from "@/src/components/appointments/AppointmentCard";
import { LoadingSpinner } from "@/src/components/shared/LoadingSpinner";
import { useAuth } from "@/src/providers/AuthProvider";
import { useAppointments, useCancelAppointment } from "@/src/hooks/use-appointments";
import { useRecords } from "@/src/hooks/use-records";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";

const logo = require("@/assets/images/logo.jpeg");

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = Colors[theme];

  const {
    data: appointmentsData,
    isLoading: loadingAppointments,
    refetch: refetchAppointments,
  } = useAppointments({
    status: ["PENDING", "CONFIRMED"],
    limit: 5,
  });

  const { data: recordsData, refetch: refetchRecords } = useRecords();
  const cancelMutation = useCancelAppointment();

  const appointments = appointmentsData?.appointments || [];
  const records = recordsData?.records || [];
  const firstName = user?.name?.split(" ")[0] || "Usuario";

  // Next appointment
  const nextAppointment = appointments
    .filter((a) => new Date(a.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

  const handleRefresh = async () => {
    await Promise.all([refetchAppointments(), refetchRecords()]);
  };

  if (loadingAppointments) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View className="flex-row items-center gap-3 py-6">
          <Image
            source={logo}
            style={{ width: 48, height: 48, borderRadius: 24 }}
            contentFit="cover"
          />
          <View>
            <Text className="text-2xl font-bold text-foreground">
              Hola, {firstName}
            </Text>
            <Text className="mt-1 text-muted-foreground">
              Bienvenido a BarberPro
            </Text>
          </View>
        </View>

        {/* Quick action */}
        <Button
          className="mb-6"
          onPress={() => router.push("/(tabs)/booking")}
        >
          <View className="flex-row items-center gap-2">
            <Plus size={18} color={colors.primaryForeground} />
            <Text className="font-semibold text-primary-foreground">
              Nueva Reserva
            </Text>
          </View>
        </Button>

        {/* Stats */}
        <View className="mb-6 flex-row gap-3">
          <Card className="flex-1">
            <View className="items-center">
              <Calendar size={20} color={colors.mutedForeground} />
              <Text className="mt-2 text-2xl font-bold text-foreground">
                {appointments.length}
              </Text>
              <Text className="text-xs text-muted-foreground">Pendientes</Text>
            </View>
          </Card>
          <Card className="flex-1">
            <View className="items-center">
              <Scissors size={20} color={colors.mutedForeground} />
              <Text className="mt-2 text-2xl font-bold text-foreground">
                {records.length}
              </Text>
              <Text className="text-xs text-muted-foreground">Cortes totales</Text>
            </View>
          </Card>
          <Card className="flex-1">
            <View className="items-center">
              <Clock size={20} color={colors.mutedForeground} />
              <Text className="mt-2 text-2xl font-bold text-foreground">
                {records[0]
                  ? format(new Date(records[0].date), "dd/MM", { locale: es })
                  : "-"}
              </Text>
              <Text className="text-xs text-muted-foreground">Último corte</Text>
            </View>
          </Card>
        </View>

        {/* Next appointment */}
        {nextAppointment && (
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-foreground">
              Próximo turno
            </Text>
            <AppointmentCard
              appointment={nextAppointment}
              onCancel={(id) => cancelMutation.mutate(id)}
              cancelling={cancelMutation.isPending}
            />
          </View>
        )}

        {/* Quick links */}
        <View className="mb-8 flex-row gap-3">
          <Pressable
            className="flex-1 items-center rounded-xl border border-border p-4"
            onPress={() => router.push("/(tabs)/appointments")}
          >
            <Calendar size={24} color={colors.foreground} />
            <Text className="mt-2 text-sm font-medium text-foreground">
              Mis Turnos
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 items-center rounded-xl border border-border p-4"
            onPress={() => router.push("/(tabs)/profile/history")}
          >
            <Scissors size={24} color={colors.foreground} />
            <Text className="mt-2 text-sm font-medium text-foreground">
              Historial
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
