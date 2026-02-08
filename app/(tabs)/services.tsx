import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ServiceCard } from "@/src/components/services/ServiceCard";
import { LoadingSpinner } from "@/src/components/shared/LoadingSpinner";
import { EmptyState } from "@/src/components/shared/EmptyState";
import { useServices } from "@/src/hooks/use-services";
import { usePromotion } from "@/src/hooks/use-promotion";
import { useBooking } from "@/src/providers/BookingProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";
import { Scissors } from "lucide-react-native";
import { View, Text } from "react-native";

export default function ServicesScreen() {
  const { data, isLoading, refetch } = useServices();
  const { data: promoData } = usePromotion();
  const { setService } = useBooking();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = Colors[theme];

  const services = data?.services || [];
  const promotion = promoData?.promotion;

  const handleServicePress = (service: (typeof services)[0]) => {
    setService(service.id, service.name, service.duration, Number(service.price));
    router.push("/(tabs)/booking");
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
        data={services}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 py-4"
        ListHeaderComponent={
          <View className="mb-4">
            <Text className="text-2xl font-bold text-foreground">Servicios</Text>
            <Text className="mt-1 text-muted-foreground">
              Elige un servicio para reservar
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="mb-3">
            <ServiceCard
              service={item}
              promotion={promotion}
              onPress={() => handleServicePress(item)}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={Scissors}
            title="Sin servicios disponibles"
            description="No hay servicios activos en este momento"
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
