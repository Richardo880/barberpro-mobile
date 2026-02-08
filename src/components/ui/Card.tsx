import React from "react";
import { View, Text } from "react-native";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <View
      className={`rounded-xl border border-border bg-card p-4 ${className || ""}`}
    >
      {children}
    </View>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return <View className={`mb-3 ${className || ""}`}>{children}</View>;
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Text className={`text-lg font-semibold text-card-foreground ${className || ""}`}>
      {children}
    </Text>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Text className={`text-sm text-muted-foreground ${className || ""}`}>
      {children}
    </Text>
  );
}

export function CardContent({ className, children }: CardProps) {
  return <View className={className || ""}>{children}</View>;
}

export function CardFooter({ className, children }: CardProps) {
  return (
    <View className={`mt-3 flex-row items-center ${className || ""}`}>
      {children}
    </View>
  );
}
