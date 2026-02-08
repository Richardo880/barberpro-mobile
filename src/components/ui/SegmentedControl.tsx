import React from "react";
import { View, Text, Pressable } from "react-native";

interface SegmentedControlProps {
  segments: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  className?: string;
}

export function SegmentedControl({
  segments,
  selectedIndex,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <View
      className={`flex-row rounded-lg bg-muted p-1 ${className || ""}`}
    >
      {segments.map((segment, index) => (
        <Pressable
          key={segment}
          className={`flex-1 items-center rounded-md py-2 ${
            index === selectedIndex ? "bg-background" : ""
          }`}
          onPress={() => onChange(index)}
        >
          <Text
            className={`text-sm font-medium ${
              index === selectedIndex
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {segment}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
