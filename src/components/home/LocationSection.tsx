import React from "react";
import { View, Text, ScrollView, Pressable, Linking, Dimensions } from "react-native";
import { Image } from "expo-image";
import { MapPin, Phone, Mail, Instagram } from "lucide-react-native";
import { Card } from "@/src/components/ui/Card";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";

const photos = [
  require("@/assets/images/front.jpeg"),
  require("@/assets/images/inside1.jpeg"),
  require("@/assets/images/inside2.jpeg"),
];

const PHOTO_WIDTH = Dimensions.get("window").width * 0.7;
const PHOTO_HEIGHT = PHOTO_WIDTH * 0.65;

export function LocationSection() {
  const { theme } = useTheme();
  const colors = Colors[theme];

  const openMaps = () => {
    Linking.openURL(
      "https://www.google.com/maps/search/?api=1&query=-25.3029776,-57.5281079"
    );
  };

  const openPhone = () => {
    Linking.openURL("tel:+595994625345");
  };

  const openEmail = () => {
    Linking.openURL("mailto:info@barberiaimperio.com");
  };

  const openInstagram = () => {
    Linking.openURL("https://www.instagram.com/barberia_imperio_0");
  };

  return (
    <View className="mb-8">
      <Text className="mb-4 text-lg font-semibold text-foreground">
        Visítanos
      </Text>

      {/* Photo carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{ gap: 12 }}
      >
        {photos.map((photo, index) => (
          <Image
            key={index}
            source={photo}
            style={{
              width: PHOTO_WIDTH,
              height: PHOTO_HEIGHT,
              borderRadius: 12,
            }}
            contentFit="cover"
          />
        ))}
      </ScrollView>

      {/* Location card */}
      <Pressable onPress={openMaps}>
        <Card className="mb-3">
          <View className="flex-row items-center gap-3">
            <MapPin size={20} color={colors.primary} />
            <View className="flex-1">
              <Text className="text-sm font-medium text-foreground">
                Ubicación
              </Text>
              <Text className="text-xs text-muted-foreground">
                San Lorenzo, Paraguay
              </Text>
            </View>
            <Text className="text-xs text-primary">Abrir mapa</Text>
          </View>
        </Card>
      </Pressable>

      {/* Contact card */}
      <Card className="mb-3">
        <Pressable onPress={openPhone} className="flex-row items-center gap-3 mb-3">
          <Phone size={20} color={colors.primary} />
          <View className="flex-1">
            <Text className="text-sm font-medium text-foreground">
              Teléfono
            </Text>
            <Text className="text-xs text-muted-foreground">
              +595 994 625345
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={openEmail} className="flex-row items-center gap-3">
          <Mail size={20} color={colors.primary} />
          <View className="flex-1">
            <Text className="text-sm font-medium text-foreground">
              Email
            </Text>
            <Text className="text-xs text-muted-foreground">
              info@barberiaimperio.com
            </Text>
          </View>
        </Pressable>
      </Card>

      {/* Instagram card */}
      <Pressable onPress={openInstagram}>
        <Card>
          <View className="flex-row items-center gap-3">
            <Instagram size={20} color={colors.primary} />
            <View className="flex-1">
              <Text className="text-sm font-medium text-foreground">
                Instagram
              </Text>
              <Text className="text-xs text-muted-foreground">
                @barberia_imperio_0
              </Text>
            </View>
            <Text className="text-xs text-primary">Seguir</Text>
          </View>
        </Card>
      </Pressable>
    </View>
  );
}
