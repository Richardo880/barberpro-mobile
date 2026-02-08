import React, { useState } from "react";
import { View, Text, TextInput, Pressable, type TextInputProps } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  className?: string;
}

export function Input({
  label,
  error,
  isPassword,
  className,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <View className={`mb-4 ${className || ""}`}>
      {label && (
        <Text className="mb-1.5 text-sm font-medium text-foreground">
          {label}
        </Text>
      )}
      <View className="relative">
        <TextInput
          className={`h-12 rounded-lg border px-4 text-base text-foreground ${
            error ? "border-destructive" : "border-input"
          } bg-background`}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <Pressable
            className="absolute right-3 top-3"
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.mutedForeground} />
            ) : (
              <Eye size={20} color={colors.mutedForeground} />
            )}
          </Pressable>
        )}
      </View>
      {error && (
        <Text className="mt-1 text-sm text-destructive">{error}</Text>
      )}
    </View>
  );
}
