import { Stack } from "expo-router";

export default function PresidentLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          title: 'President Dashboard',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="members" 
        options={{ 
          title: 'Members',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="membership-requests" 
        options={{ 
          title: 'Membership Requests',
          headerShown: true 
        }} 
      />
    </Stack>
  );
}
