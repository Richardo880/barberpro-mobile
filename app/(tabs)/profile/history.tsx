import React, { useState } from "react";
import { View, Text, FlatList, RefreshControl, Pressable, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Scissors, X } from "lucide-react-native";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { EmptyState } from "@/src/components/shared/EmptyState";
import { LoadingSpinner } from "@/src/components/shared/LoadingSpinner";
import { useRecords } from "@/src/hooks/use-records";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";
import type { HaircutRecord } from "@/src/types";

export default function HistoryScreen() {
  const { data, isLoading, refetch } = useRecords();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const records = data?.records || [];

  const renderRecord = ({ item }: { item: HaircutRecord }) => (
    <Card className="mb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {item.service.name}
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground">
            {format(new Date(item.date), "d 'de' MMMM, yyyy", { locale: es })}
          </Text>
          {item.staff && (
            <Text className="text-sm text-muted-foreground">
              Barbero: {item.staff.name}
            </Text>
          )}
        </View>
        <View className="items-end">
          <Text className="text-base font-bold text-foreground">
            {Number(item.price).toLocaleString()} Gs
          </Text>
          {item.promotionApplied && item.originalPrice && (
            <Text className="text-xs text-muted-foreground line-through">
              {Number(item.originalPrice).toLocaleString()} Gs
            </Text>
          )}
        </View>
      </View>

      {item.notes && (
        <Text className="mt-2 text-sm text-muted-foreground">
          {item.notes}
        </Text>
      )}

      {item.tags.length > 0 && (
        <View className="mt-2 flex-row flex-wrap gap-1">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </View>
      )}

      {item.photoUrls.length > 0 && (
        <View className="mt-3 flex-row gap-2">
          {item.photoUrls.map((url, idx) => (
            <Pressable key={idx} onPress={() => setViewingImage(url)}>
              <Image
                source={{ uri: url }}
                style={{ width: 64, height: 64, borderRadius: 8 }}
                contentFit="cover"
              />
            </Pressable>
          ))}
        </View>
      )}
    </Card>
  );

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
        data={records}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 py-4"
        ListHeaderComponent={
          <View className="mb-4 flex-row items-center gap-3">
            <Pressable onPress={() => router.replace("/(tabs)/profile")}>
              <ArrowLeft size={24} color={colors.foreground} />
            </Pressable>
            <Text className="text-xl font-bold text-foreground">
              Historial de Cortes
            </Text>
          </View>
        }
        renderItem={renderRecord}
        ListEmptyComponent={
          <EmptyState
            icon={Scissors}
            title="Sin historial"
            description="Aquí aparecerán tus cortes completados"
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

      {/* Image viewer modal */}
      <Modal visible={!!viewingImage} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black">
          <Pressable
            className="absolute top-12 right-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-black/50"
            onPress={() => setViewingImage(null)}
          >
            <X size={24} color="white" />
          </Pressable>
          {viewingImage && (
            <Image
              source={{ uri: viewingImage }}
              style={{ width: "100%", height: "80%" }}
              contentFit="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
