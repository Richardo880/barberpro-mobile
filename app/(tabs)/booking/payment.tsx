import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { CreditCard, Upload, X, ImageIcon } from "lucide-react-native";
import { ProgressBar } from "@/src/components/ui/ProgressBar";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { useBooking } from "@/src/providers/BookingProvider";
import { usePromotion, getDiscountedPrice } from "@/src/hooks/use-promotion";
import { uploadFile } from "@/src/lib/api-client";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";
import Toast from "react-native-toast-message";

export default function BookingStep4() {
  const booking = useBooking();
  const { data: promoData } = usePromotion();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = Colors[theme];

  const [uploading, setUploading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const getServicePrice = () => {
    if (!booking.serviceId || !booking.servicePrice) return booking.servicePrice || 0;
    const { finalPrice } = getDiscountedPrice(
      booking.servicePrice,
      booking.serviceId,
      promoData?.promotion,
      booking.date ?? undefined
    );
    return finalPrice;
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permiso denegado",
        text2: "Necesitamos acceso a tu galería para subir el comprobante",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: false,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];

    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      Toast.show({
        type: "error",
        text1: "Archivo muy grande",
        text2: "El comprobante no puede superar 5MB",
      });
      return;
    }

    setPreviewUri(asset.uri);
    setUploading(true);

    try {
      const response = await uploadFile<{ url: string }>(
        "/api/upload/transfers",
        asset.uri
      );
      booking.setPaymentProof(response.url);
      Toast.show({
        type: "success",
        text1: "Comprobante subido",
        text2: "El comprobante se subió correctamente",
      });
    } catch (error) {
      setPreviewUri(null);
      booking.setPaymentProof(null);
      Toast.show({
        type: "error",
        text1: "Error al subir",
        text2: error instanceof Error ? error.message : "Intentá de nuevo",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permiso denegado",
        text2: "Necesitamos acceso a tu cámara para tomar la foto",
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: false,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setPreviewUri(asset.uri);
    setUploading(true);

    try {
      const response = await uploadFile<{ url: string }>(
        "/api/upload/transfers",
        asset.uri
      );
      booking.setPaymentProof(response.url);
      Toast.show({
        type: "success",
        text1: "Comprobante subido",
        text2: "El comprobante se subió correctamente",
      });
    } catch (error) {
      setPreviewUri(null);
      booking.setPaymentProof(null);
      Toast.show({
        type: "error",
        text1: "Error al subir",
        text2: error instanceof Error ? error.message : "Intentá de nuevo",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveProof = () => {
    setPreviewUri(null);
    booking.setPaymentProof(null);
  };

  const handleNext = () => {
    if (!booking.paymentProofUrl) return;
    router.push("/(tabs)/booking/confirm");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 py-4">
        <ProgressBar progress={80} className="mb-4" />
        <Text className="text-xl font-bold text-foreground">
          Paso 4: Comprobante de pago
        </Text>
        <Text className="mt-1 mb-6 text-sm text-muted-foreground">
          Realizá la transferencia y subí el comprobante
        </Text>

        {/* Bank details */}
        <Card className="mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <CreditCard size={20} color={colors.primary} />
            <Text className="text-base font-semibold text-foreground">
              Datos para transferencia
            </Text>
          </View>

          <Text className="text-sm text-muted-foreground mb-3">
            Realiza la transferencia con los siguientes datos y luego sube el comprobante.
          </Text>

          <View className="rounded-lg border border-border bg-muted/50 p-4 gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted-foreground">Banco:</Text>
              <Text className="text-sm font-medium text-foreground">Ueno Bank</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted-foreground">Titular:</Text>
              <Text className="text-sm font-medium text-foreground">Edgar Cohene</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted-foreground">Alias:</Text>
              <Text className="text-sm font-medium text-foreground">5741753</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted-foreground">Nro. Cuenta:</Text>
              <Text className="text-sm font-medium text-foreground">18147097</Text>
            </View>
            <View className="border-t border-border pt-2 mt-1 flex-row justify-between">
              <Text className="text-sm text-muted-foreground">Monto a transferir:</Text>
              <Text className="text-sm font-semibold text-primary">
                {getServicePrice().toLocaleString()} Gs
              </Text>
            </View>
          </View>
        </Card>

        {/* Upload section */}
        <Card className="mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <ImageIcon size={20} color={colors.primary} />
            <Text className="text-base font-semibold text-foreground">
              Subir comprobante
            </Text>
          </View>

          {previewUri ? (
            <View>
              <View className="relative rounded-lg overflow-hidden border border-border">
                <Image
                  source={{ uri: previewUri }}
                  className="w-full h-64"
                  resizeMode="contain"
                  style={{ backgroundColor: colors.muted }}
                />
                {uploading && (
                  <View className="absolute inset-0 items-center justify-center bg-black/40">
                    <ActivityIndicator size="large" color="#fff" />
                    <Text className="mt-2 text-white font-medium">Subiendo...</Text>
                  </View>
                )}
              </View>
              {!uploading && (
                <Pressable
                  className="mt-3 flex-row items-center justify-center gap-2 rounded-lg border border-destructive py-2"
                  onPress={handleRemoveProof}
                >
                  <X size={16} color={colors.destructive} />
                  <Text className="text-sm font-medium text-destructive">
                    Eliminar comprobante
                  </Text>
                </Pressable>
              )}
            </View>
          ) : (
            <View className="gap-3">
              <Pressable
                className="items-center justify-center rounded-lg border-2 border-dashed border-border py-10"
                onPress={handlePickImage}
              >
                <Upload size={32} color={colors.mutedForeground} />
                <Text className="mt-2 text-sm font-medium text-muted-foreground">
                  Seleccionar de galería
                </Text>
                <Text className="mt-1 text-xs text-muted-foreground">
                  JPG, PNG (máx. 5MB)
                </Text>
              </Pressable>

              <Button variant="outline" onPress={handleTakePhoto}>
                Tomar foto
              </Button>
            </View>
          )}
        </Card>

        <View className="mb-8 flex-row gap-3">
          <Button variant="outline" className="flex-1" onPress={() => router.back()}>
            Volver
          </Button>
          <Button
            className="flex-1"
            onPress={handleNext}
            disabled={!booking.paymentProofUrl || uploading}
          >
            Continuar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
