import React from "react";
import { Text } from "react-native";

const createIconSet = (name: string) => {
  const Icon = (props: any) =>
    React.createElement(Text, { testID: `icon-${name}`, ...props }, props.name || "");
  Icon.displayName = name;
  return Icon;
};

export const Ionicons = createIconSet("Ionicons");
export const MaterialIcons = createIconSet("MaterialIcons");
export const FontAwesome = createIconSet("FontAwesome");
export const Feather = createIconSet("Feather");
