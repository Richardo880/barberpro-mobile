import React from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ProgressBar } from "@/src/components/ui/ProgressBar";
import { ServiceCard } from "@/src/components/services/ServiceCard";
import { LoadingSpinner } from "@/src/components/shared/LoadingSpinner";
import { useServices } from "@/src/hooks/use-services";
import { usePromotion } from "@/src/hooks/use-promotion";
import { useBooking } from "@/src/providers/BookingProvider";

export default function BookingStep1() {
  const { data, isLoading } = useServices();
  const { data: promoData } = usePromotion();
  const { serviceId, setService } = useBooking();
  const router = useRouter();

  const services = data?.services || [];
  const promotion = promoData?.promotion;

  const handleSelect = (service: (typeof services)[0]) => {
    setService(service.id, service.name, service.duration, Number(service.price));
    router.push("/(tabs)/booking/staff");
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
            <ProgressBar progress={25} className="mb-4" />
            <Text className="text-xl font-bold text-foreground">
              Paso 1: Elegí un servicio
            </Text>
            <Text className="mt-1 text-sm text-muted-foreground">
              Seleccioná el servicio que deseas
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="mb-3">
            <ServiceCard
              service={item}
              promotion={promotion}
              onPress={() => handleSelect(item)}
              selected={serviceId === item.id}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
