import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function PlantersLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fff' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="my-trees" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="tree-details" />
      </Stack>
    </SafeAreaView>
  );
}
