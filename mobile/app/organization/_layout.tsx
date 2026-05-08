import { Stack } from 'expo-router';
import { useAuth } from '@/src/context/auth-context';

export default function OrganizationLayout() {
  const { user } = useAuth();

  return (
    <Stack>
      <Stack.Screen 
        name="president" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="member" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="member/index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="member/my-trees" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="member/tree-details" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="member/profile" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="member/join-organization" 
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
