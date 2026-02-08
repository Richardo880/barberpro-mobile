import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Scissors } from "lucide-react-native";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { useAuth } from "@/src/providers/AuthProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Completa todos los campos",
      });
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error al iniciar sesión",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-8">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4">
              <Scissors size={32} color={colors.primaryForeground} />
            </View>
            <Text className="text-3xl font-bold text-foreground">
              BarberPro
            </Text>
            <Text className="mt-2 text-muted-foreground">
              Inicia sesión en tu cuenta
            </Text>
          </View>

          <Input
            label="Email"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Contraseña"
            placeholder="Tu contraseña"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <Button
            className="mt-2"
            onPress={handleLogin}
            loading={loading}
          >
            Iniciar Sesión
          </Button>

          <View className="mt-6 flex-row items-center justify-center gap-1">
            <Text className="text-muted-foreground">
              ¿No tienes cuenta?
            </Text>
            <Link href="/(auth)/register" asChild>
              <Text className="font-semibold text-primary">
                Regístrate
              </Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
