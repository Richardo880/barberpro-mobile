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
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { useAuth } from "@/src/providers/AuthProvider";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Completa los campos requeridos",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Las contraseñas no coinciden",
      });
      return;
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "La contraseña debe tener 8+ caracteres, una mayúscula y un número",
      });
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error al registrarse",
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
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground">
              Crear Cuenta
            </Text>
            <Text className="mt-2 text-muted-foreground">
              Regístrate para reservar tus turnos
            </Text>
          </View>

          <Input
            label="Nombre *"
            placeholder="Tu nombre completo"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Input
            label="Email *"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Teléfono"
            placeholder="+595 981 123 456"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Input
            label="Contraseña *"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <Input
            label="Confirmar Contraseña *"
            placeholder="Repetir contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
          />

          <Button
            className="mt-2"
            onPress={handleRegister}
            loading={loading}
          >
            Crear Cuenta
          </Button>

          <View className="mt-6 flex-row items-center justify-center gap-1">
            <Text className="text-muted-foreground">
              ¿Ya tienes cuenta?
            </Text>
            <Link href="/(auth)/login" asChild>
              <Text className="font-semibold text-primary">
                Inicia Sesión
              </Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
