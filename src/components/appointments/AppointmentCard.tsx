import React from "react";
import { View, Text, Alert } from "react-native";
import { Calendar, Clock, User, Scissors } from "lucide-react-native";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";
import {
  statusLabels,
  statusColors,
  statusBackgrounds,
} from "@/src/constants/status";
import type { Appointment, AppointmentStatus } from "@/src/types";

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  cancelling?: boolean;
}

export function AppointmentCard({
  appointment,
  onCancel,
  cancelling,
}: AppointmentCardProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const status = appointment.status as AppointmentStatus;
  const startDate = new Date(appointment.startTime);
  const canCancel =
    (status === "PENDING" || status === "CONFIRMED") && onCancel;

  const handleCancel = () => {
    Alert.alert(
      "Cancelar turno",
      "¿Estás seguro de que deseas cancelar este turno?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: () => onCancel?.(appointment.id),
        },
      ]
    );
  };

  return (
    <Card className="mb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Scissors size={16} color={colors.foreground} />
            <Text className="text-base font-semibold text-foreground">
              {appointment.service.name}
            </Text>
          </View>

          <View className="mt-2 flex-row items-center gap-2">
            <Calendar size={14} color={colors.mutedForeground} />
            <Text className="text-sm text-muted-foreground">
              {format(startDate, "EEEE d 'de' MMMM", { locale: es })}
            </Text>
          </View>

          <View className="mt-1 flex-row items-center gap-2">
            <Clock size={14} color={colors.mutedForeground} />
            <Text className="text-sm text-muted-foreground">
              {format(startDate, "HH:mm")} hs
            </Text>
          </View>

          {appointment.staff && (
            <View className="mt-1 flex-row items-center gap-2">
              <User size={14} color={colors.mutedForeground} />
              <Text className="text-sm text-muted-foreground">
                {appointment.staff.name}
              </Text>
            </View>
          )}

          <Text className="mt-2 text-sm font-medium text-foreground">
            {Number(appointment.service.price).toLocaleString()} Gs
          </Text>
        </View>

        <Badge
          backgroundColor={statusBackgrounds[status]}
          color={statusColors[status]}
        >
          {statusLabels[status]}
        </Badge>
      </View>

      {appointment.clientNotes && (
        <View className="mt-3 rounded-md bg-muted p-2">
          <Text className="text-xs text-muted-foreground">
            {appointment.clientNotes}
          </Text>
        </View>
      )}

      {canCancel && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onPress={handleCancel}
          loading={cancelling}
        >
          Cancelar turno
        </Button>
      )}
    </Card>
  );
}
