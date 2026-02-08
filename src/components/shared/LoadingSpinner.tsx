import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  className?: string;
}

export function LoadingSpinner({
  size = "large",
  className,
}: LoadingSpinnerProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <View className={`flex-1 items-center justify-center ${className || ""}`}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}
