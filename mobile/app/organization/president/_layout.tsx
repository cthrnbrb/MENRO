import { Stack } from "expo-router";

export default function PresidentLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="home" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="members" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="geo-tag-tree" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="membership-requests" 
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
