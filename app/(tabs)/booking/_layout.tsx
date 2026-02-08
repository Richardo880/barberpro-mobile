import { Stack } from "expo-router";

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="staff" />
      <Stack.Screen name="datetime" />
      <Stack.Screen name="confirm" />
    </Stack>
  );
}
