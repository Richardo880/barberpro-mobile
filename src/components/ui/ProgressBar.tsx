import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View className={`h-2 rounded-full bg-muted ${className || ""}`}>
      <View
        className="h-full rounded-full bg-primary"
        style={{ width: `${clampedProgress}%` }}
      />
    </View>
  );
}
