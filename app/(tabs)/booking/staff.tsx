import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { UserX } from "lucide-react-native";
import { ProgressBar } from "@/src/components/ui/ProgressBar";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { StaffCard } from "@/src/components/staff/StaffCard";
import { LoadingSpinner } from "@/src/components/shared/LoadingSpinner";
import { useStaff } from "@/src/hooks/use-staff";
import { useBooking } from "@/src/providers/BookingProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";

export default function BookingStep2() {
  const { data, isLoading } = useStaff();
  const { staffId, setStaff } = useBooking();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = Colors[theme];

  const staffMembers = data?.staff || [];

  const handleSelect = (id: string | null, name: string | null) => {
    setStaff(id, name);
    router.push("/(tabs)/booking/datetime");
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={staffMembers}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 py-4"
        ListHeaderComponent={
          <View className="mb-4">
            <ProgressBar progress={50} className="mb-4" />
            <Text className="text-xl font-bold text-foreground">
              Paso 2: Elegí tu barbero
            </Text>
            <Text className="mt-1 mb-4 text-sm text-muted-foreground">
              Seleccioná un barbero o dejá sin preferencia
            </Text>
            <Pressable onPress={() => handleSelect(null, null)}>
              <Card
                className={`flex-row items-center gap-3 mb-3 ${staffId === null ? "border-2 border-primary" : ""}`}
              >
                <View className="h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <UserX size={24} color={colors.mutedForeground} />
                </View>
                <View>
                  <Text className="text-base font-semibold text-foreground">
                    Sin preferencia
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Cualquier barbero disponible
                  </Text>
                </View>
              </Card>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <View className="mb-3">
            <StaffCard
              staff={item}
              onPress={() => handleSelect(item.id, item.name)}
              selected={staffId === item.id}
            />
          </View>
        )}
        ListFooterComponent={
          <Button
            variant="outline"
            className="mt-4 mb-8"
            onPress={() => router.back()}
          >
            Volver
          </Button>
        }
      />
    </SafeAreaView>
  );
}
