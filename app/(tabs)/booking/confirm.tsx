import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, Calendar, Clock, User, Scissors } from "lucide-react-native";
import { ProgressBar } from "@/src/components/ui/ProgressBar";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { useCreateAppointment } from "@/src/hooks/use-appointments";
import { useBooking } from "@/src/providers/BookingProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";

export default function BookingStep4() {
  const booking = useBooking();
  const createMutation = useCreateAppointment();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [notes, setNotes] = useState(booking.notes);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!booking.serviceId || !booking.slotStart) return;

    try {
      await createMutation.mutateAsync({
        serviceId: booking.serviceId,
        staffId: booking.staffId || undefined,
        startTime: booking.slotStart,
        clientNotes: notes.trim() || undefined,
      });
      setShowSuccess(true);
    } catch {
      // Error handled by mutation's onError
    }
  };

  const handleDone = () => {
    setShowSuccess(false);
    booking.reset();
    router.replace("/(tabs)/appointments");
  };

  const dateFormatted = booking.date
    ? format(new Date(booking.date), "EEEE d 'de' MMMM, yyyy", { locale: es })
    : "";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 py-4">
        <ProgressBar progress={100} className="mb-4" />
        <Text className="text-xl font-bold text-foreground">
          Paso 4: Confirmar reserva
        </Text>
        <Text className="mt-1 mb-6 text-sm text-muted-foreground">
          Revisá los detalles de tu turno
        </Text>

        <Card className="mb-4">
          <View className="gap-3">
            <View className="flex-row items-center gap-3">
              <Scissors size={18} color={colors.foreground} />
              <View>
                <Text className="text-xs text-muted-foreground">Servicio</Text>
                <Text className="text-base font-medium text-foreground">
                  {booking.serviceName}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3">
              <User size={18} color={colors.foreground} />
              <View>
                <Text className="text-xs text-muted-foreground">Barbero</Text>
                <Text className="text-base font-medium text-foreground">
                  {booking.staffName || "Sin preferencia"}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3">
              <Calendar size={18} color={colors.foreground} />
              <View>
                <Text className="text-xs text-muted-foreground">Fecha</Text>
                <Text className="text-base font-medium text-foreground capitalize">
                  {dateFormatted}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3">
              <Clock size={18} color={colors.foreground} />
              <View>
                <Text className="text-xs text-muted-foreground">Hora</Text>
                <Text className="text-base font-medium text-foreground">
                  {booking.timeSlot} hs ({booking.serviceDuration} min)
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-4 border-t border-border pt-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-muted-foreground">Total</Text>
              <Text className="text-xl font-bold text-foreground">
                {(booking.servicePrice || 0).toLocaleString()} Gs
              </Text>
            </View>
          </View>
        </Card>

        <View className="mb-4">
          <Text className="mb-1.5 text-sm font-medium text-foreground">
            Notas (opcional)
          </Text>
          <TextInput
            className="h-24 rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground"
            placeholder="Ej: Quiero un fade bajo..."
            placeholderTextColor={colors.mutedForeground}
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
        </View>

        <View className="mb-8 flex-row gap-3">
          <Button variant="outline" className="flex-1" onPress={() => router.back()}>
            Volver
          </Button>
          <Button
            className="flex-1"
            onPress={handleConfirm}
            loading={createMutation.isPending}
          >
            Confirmar Reserva
          </Button>
        </View>
      </ScrollView>

      {/* Success modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full rounded-2xl bg-card p-8 items-center">
            <CheckCircle2 size={64} color="#22c55e" />
            <Text className="mt-4 text-xl font-bold text-foreground">
              Turno Reservado
            </Text>
            <Text className="mt-2 text-center text-muted-foreground">
              Tu turno ha sido reservado exitosamente. Te esperamos.
            </Text>
            <Button className="mt-6 w-full" onPress={handleDone}>
              Ver mis turnos
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
