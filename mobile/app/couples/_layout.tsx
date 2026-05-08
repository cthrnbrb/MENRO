import { Stack } from "expo-router";

export default function CouplesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="my-trees" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="update-tree" options={{ headerShown: false }} />
    </Stack>
  );
}
