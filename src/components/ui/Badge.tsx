import React from "react";
import { View, Text } from "react-native";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  color?: string;
  backgroundColor?: string;
  className?: string;
}

const variantStyles = {
  default: "bg-primary",
  secondary: "bg-secondary",
  destructive: "bg-destructive",
  outline: "border border-border bg-transparent",
};

const variantTextStyles = {
  default: "text-primary-foreground",
  secondary: "text-secondary-foreground",
  destructive: "text-destructive-foreground",
  outline: "text-foreground",
};

export function Badge({
  children,
  variant = "default",
  color,
  backgroundColor,
  className,
}: BadgeProps) {
  return (
    <View
      className={`rounded-full px-2.5 py-0.5 ${variantStyles[variant]} ${className || ""}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <Text
        className={`text-xs font-medium ${variantTextStyles[variant]}`}
        style={color ? { color } : undefined}
      >
        {children}
      </Text>
    </View>
  );
}
