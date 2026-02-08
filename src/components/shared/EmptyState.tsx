import React from "react";
import { View, Text } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { Button } from "@/src/components/ui/Button";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Colors } from "@/src/constants/colors";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <View className="flex-1 items-center justify-center p-8">
      {Icon && (
        <Icon size={48} color={colors.mutedForeground} strokeWidth={1.5} />
      )}
      <Text className="mt-4 text-center text-lg font-semibold text-foreground">
        {title}
      </Text>
      {description && (
        <Text className="mt-2 text-center text-sm text-muted-foreground">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button className="mt-6" onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}
