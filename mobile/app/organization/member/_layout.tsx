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
        name="my-trees" 
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
        name="join-organization" 
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
