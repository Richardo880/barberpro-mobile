import React from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Clock, Scissors } from "lucide-react-native";
import { Card } from "@/src/components/ui/Card";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";
import type { Service } from "@/src/types";
import type { PromotionConfig } from "@/src/hooks/use-promotion";
import { getDiscountedPrice } from "@/src/hooks/use-promotion";

interface ServiceCardProps {
  service: Service;
  promotion?: PromotionConfig;
  onPress?: () => void;
  selected?: boolean;
}

export function ServiceCard({
  service,
  promotion,
  onPress,
  selected,
}: ServiceCardProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const price = Number(service.price);
  const { finalPrice, hasDiscount } = getDiscountedPrice(
    price,
    service.id,
    promotion
  );

  return (
    <Pressable onPress={onPress}>
      <Card
        className={`overflow-hidden ${selected ? "border-2 border-primary" : ""}`}
      >
        {service.imageUrl ? (
          <Image
            source={{ uri: service.imageUrl }}
            style={{ width: "100%", height: 140, borderRadius: 8 }}
            contentFit="cover"
          />
        ) : (
          <View className="h-36 items-center justify-center rounded-lg bg-muted">
            <Scissors size={40} color={colors.mutedForeground} />
          </View>
        )}
        <View className="mt-3">
          <Text className="text-base font-semibold text-foreground">
            {service.name}
          </Text>
          {service.description && (
            <Text
              className="mt-1 text-sm text-muted-foreground"
              numberOfLines={2}
            >
              {service.description}
            </Text>
          )}
          <View className="mt-2 flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <Clock size={14} color={colors.mutedForeground} />
              <Text className="text-sm text-muted-foreground">
                {service.duration} min
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              {hasDiscount && (
                <Text className="text-sm text-muted-foreground line-through">
                  {price.toLocaleString()} Gs
                </Text>
              )}
              <Text className="text-base font-bold text-foreground">
                {finalPrice.toLocaleString()} Gs
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
