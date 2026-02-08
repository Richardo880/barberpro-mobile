import { Platform } from "react-native";

export const API_BASE_URL = __DEV__
  ? Platform.select({
      android: "http://10.0.2.2:3000", // Android emulator -> host localhost
      default: "http://192.168.100.91:3000", // Physical devices / iOS -> LAN IP
    })!
  : "https://your-production-domain.com";
