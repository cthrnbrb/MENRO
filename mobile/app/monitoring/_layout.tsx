import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function MonitoringLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fff' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="interventions" />
        <Stack.Screen name="plots" />
        <Stack.Screen name="add" />
      </Stack>
    </SafeAreaView>
  );
}
