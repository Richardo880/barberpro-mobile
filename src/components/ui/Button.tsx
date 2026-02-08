import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  type PressableProps,
} from "react-native";

interface ButtonProps extends PressableProps {
  variant?: "default" | "destructive" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  default: "bg-primary",
  destructive: "bg-destructive",
  outline: "border border-border bg-transparent",
  ghost: "bg-transparent",
  secondary: "bg-secondary",
};

const variantTextStyles = {
  default: "text-primary-foreground",
  destructive: "text-destructive-foreground",
  outline: "text-foreground",
  ghost: "text-foreground",
  secondary: "text-secondary-foreground",
};

const sizeStyles = {
  default: "h-12 px-6 py-3",
  sm: "h-9 px-3 py-2",
  lg: "h-14 px-8 py-4",
  icon: "h-10 w-10",
};

const sizeTextStyles = {
  default: "text-base",
  sm: "text-sm",
  lg: "text-lg",
  icon: "text-base",
};

export function Button({
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps & { className?: string }) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={`flex-row items-center justify-center rounded-lg ${variantStyles[variant]} ${sizeStyles[size]} ${isDisabled ? "opacity-50" : ""} ${className || ""}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? "#171717" : "#fafafa"}
        />
      ) : typeof children === "string" ? (
        <Text
          className={`font-semibold ${variantTextStyles[variant]} ${sizeTextStyles[size]}`}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
