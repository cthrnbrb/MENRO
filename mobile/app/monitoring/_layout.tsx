import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function MonitoringLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fff' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="assignment" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="map" />
        <Stack.Screen name="add" />
        <Stack.Screen name="notifications" />
      </Stack>
    </SafeAreaView>
  );
}
