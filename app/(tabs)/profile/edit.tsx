import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { useAuth } from "@/src/providers/AuthProvider";
import { useUpdateProfile } from "@/src/hooks/use-users";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";
import { Pressable } from "react-native";

export default function EditProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const updateMutation = useUpdateProfile(user?.id || "");

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");

  const handleSave = async () => {
    const data: { name?: string; phone?: string } = {};
    if (name.trim() && name.trim() !== user?.name) data.name = name.trim();
    if (phone.trim()) data.phone = phone.trim();

    if (Object.keys(data).length === 0) {
      router.replace("/(tabs)/profile");
      return;
    }

    try {
      await updateMutation.mutateAsync(data);
      router.replace("/(tabs)/profile");
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.replace("/(tabs)/profile")} className="mb-4">
            <ArrowLeft size={24} color={colors.foreground} />
          </Pressable>

          <Text className="text-xl font-bold text-foreground mb-6">
            Editar Perfil
          </Text>

          <Input
            label="Nombre"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Input
            label="Email"
            value={user?.email || ""}
            editable={false}
            className="opacity-50"
          />

          <Input
            label="Teléfono"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+595 981 123 456"
          />

          <Button
            className="mt-4"
            onPress={handleSave}
            loading={updateMutation.isPending}
          >
            Guardar Cambios
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
