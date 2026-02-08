import React from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  UserPen,
  Lock,
  Scissors,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import { Avatar } from "@/src/components/ui/Avatar";
import { useAuth } from "@/src/providers/AuthProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

function MenuItem({
  icon,
  label,
  onPress,
  rightElement,
  destructive,
}: MenuItemProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <Pressable
      className="flex-row items-center justify-between py-4 border-b border-border"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-3">
        {icon}
        <Text
          className={`text-base ${destructive ? "text-destructive" : "text-foreground"}`}
        >
          {label}
        </Text>
      </View>
      {rightElement || (
        <ChevronRight size={20} color={colors.mutedForeground} />
      )}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4">
        <View className="items-center py-8">
          <Avatar name={user?.name || "U"} size={80} />
          <Text className="mt-3 text-xl font-bold text-foreground">
            {user?.name}
          </Text>
          <Text className="mt-1 text-muted-foreground">{user?.email}</Text>
        </View>

        <View className="mb-8">
          <MenuItem
            icon={<UserPen size={20} color={colors.foreground} />}
            label="Editar Perfil"
            onPress={() => router.push("/(tabs)/profile/edit")}
          />
          <MenuItem
            icon={<Lock size={20} color={colors.foreground} />}
            label="Cambiar Contraseña"
            onPress={() => router.push("/(tabs)/profile/password")}
          />
          <MenuItem
            icon={<Scissors size={20} color={colors.foreground} />}
            label="Historial de Cortes"
            onPress={() => router.push("/(tabs)/profile/history")}
          />
          <MenuItem
            icon={
              isDark ? (
                <Moon size={20} color={colors.foreground} />
              ) : (
                <Sun size={20} color={colors.foreground} />
              )
            }
            label={isDark ? "Modo Oscuro" : "Modo Claro"}
            onPress={toggleTheme}
            rightElement={
              <Text className="text-sm text-muted-foreground">
                {isDark ? "Oscuro" : "Claro"}
              </Text>
            }
          />
          <MenuItem
            icon={<LogOut size={20} color={colors.destructive} />}
            label="Cerrar Sesión"
            onPress={handleLogout}
            destructive
          />
        </View>

        <Text className="text-center text-xs text-muted-foreground mb-8">
          BarberPro v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
