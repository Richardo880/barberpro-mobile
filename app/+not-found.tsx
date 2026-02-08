import { View, Text } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-xl font-bold text-foreground">
          Pantalla no encontrada
        </Text>
        <Link href="/" className="mt-4">
          <Text className="text-primary underline">Volver al inicio</Text>
        </Link>
      </View>
    </>
  );
}
