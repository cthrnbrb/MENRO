import { Stack } from "expo-router";
import "../global.css";
import { QueryProvider } from "@/src/providers/QueryProvider";

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="couples" options={{ headerShown: false }} />
        <Stack.Screen name="monitoring" options={{ headerShown: false }} />
        <Stack.Screen name="organization" options={{ headerShown: false }} />
      </Stack>
    </QueryProvider>
  );
}
