import React from "react";
import { View } from "react-native";

const createIcon = (name: string) => {
  const Icon = (props: any) =>
    React.createElement(View, { testID: `icon-${name}`, ...props });
  Icon.displayName = name;
  return Icon;
};

export const Scissors = createIcon("Scissors");
export const Eye = createIcon("Eye");
export const EyeOff = createIcon("EyeOff");
export const Clock = createIcon("Clock");
export const Calendar = createIcon("Calendar");
export const User = createIcon("User");
export const ChevronRight = createIcon("ChevronRight");
export const ChevronLeft = createIcon("ChevronLeft");
export const Search = createIcon("Search");
export const Star = createIcon("Star");
export const MapPin = createIcon("MapPin");
export const Phone = createIcon("Phone");
export const Mail = createIcon("Mail");
export const Settings = createIcon("Settings");
export const LogOut = createIcon("LogOut");
export const Home = createIcon("Home");
export const CalendarDays = createIcon("CalendarDays");
export const UserCircle = createIcon("UserCircle");
export const Plus = createIcon("Plus");
export const X = createIcon("X");
export const Check = createIcon("Check");
export const AlertCircle = createIcon("AlertCircle");
export const Info = createIcon("Info");
export const Camera = createIcon("Camera");
export const Image = createIcon("Image");
export const Trash = createIcon("Trash");
export const Edit = createIcon("Edit");
export const ArrowLeft = createIcon("ArrowLeft");
export const Lock = createIcon("Lock");
export const History = createIcon("History");
export const Tag = createIcon("Tag");

export type LucideIcon = React.FC<any>;
