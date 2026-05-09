import { Stack } from 'expo-router';
import { useAuth } from '@/src/context/auth-context';

export default function OrganizationLayout() {
  const { user } = useAuth();

  return (
    <Stack>
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          headerShown: false 
        }} 
      />
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
    </Stack>
  );
}