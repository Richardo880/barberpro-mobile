import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";

interface AvatarProps {
  source?: string | null;
  name: string;
  size?: number;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ source, name, size = 40, className }: AvatarProps) {
  if (source) {
    return (
      <Image
        source={{ uri: source }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        className={className}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      className={`items-center justify-center rounded-full bg-primary ${className || ""}`}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      <Text
        className="font-semibold text-primary-foreground"
        style={{ fontSize: size * 0.35 }}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
}
