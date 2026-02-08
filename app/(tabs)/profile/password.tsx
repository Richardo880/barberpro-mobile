import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { useAuth } from "@/src/providers/AuthProvider";
import { useChangePassword } from "@/src/hooks/use-users";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";
import Toast from "react-native-toast-message";

export default function ChangePasswordScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const changeMutation = useChangePassword(user?.id || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Completa todos los campos",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Las contraseñas no coinciden",
      });
      return;
    }

    try {
      await changeMutation.mutateAsync({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      router.back();
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
          <Pressable onPress={() => router.back()} className="mb-4">
            <ArrowLeft size={24} color={colors.foreground} />
          </Pressable>

          <Text className="text-xl font-bold text-foreground mb-6">
            Cambiar Contraseña
          </Text>

          <Input
            label="Contraseña actual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            isPassword
          />

          <Input
            label="Nueva contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            isPassword
            placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
          />

          <Input
            label="Confirmar nueva contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
          />

          <Button
            className="mt-4"
            onPress={handleSave}
            loading={changeMutation.isPending}
          >
            Cambiar Contraseña
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
