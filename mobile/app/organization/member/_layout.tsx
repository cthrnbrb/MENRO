import { Stack } from "expo-router";

export default function MemberLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="tree-details" 
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
        name="notification" 
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
