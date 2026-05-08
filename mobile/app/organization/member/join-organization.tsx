import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/src/context/auth-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function JoinOrganizationScreen() {
  const router = useRouter();
  const { validateCode, joinOrganization, loading } = useAuth();

  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleValidateCode = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter an organization code');
      return;
    }

    setIsValidating(true);
    setIsValid(null);

    try {
      const valid = await validateCode(code.trim().toUpperCase());
      setIsValid(valid);
      
      if (valid) {
        Alert.alert(
          'Valid Code',
          'Organization found! Would you like to join?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Join',
              onPress: handleJoinOrganization,
            },
          ]
        );
      }
    } catch (error) {
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleJoinOrganization = async () => {
    try {
      await joinOrganization({ code: code.trim().toUpperCase() });
    } catch (error) {
      console.error('Join organization error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="items-center overflow-hidden" style={{ height: 300 }}>
          <View
            className="absolute"
            style={{
              width: '100%',
              height: 240,
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Image
              source={require("@/assets/images/cover.jpg")}
              style={{ width: '100%', height: 240 }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Content */}
        <View className="px-8 pt-6">
          <Text className="text-4xl font-bold text-green-600 mb-1 text-center">
            Join Organization
          </Text>

          <Text className="text-gray-500 text-lg text-center mb-8">
            Enter your organization code to join
          </Text>

          {/* Code Input */}
          <View className="mb-6">
            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm">
              <MaterialIcons
                name="vpn-key"
                size={24}
                color="#999"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-lg text-gray-800 text-center font-mono"
                placeholder="Enter organization code"
                placeholderTextColor="#999"
                value={code}
                onChangeText={(text) => {
                  setCode(text.toUpperCase());
                  setIsValid(null);
                }}
                maxLength={20}
                autoCapitalize="characters"
                editable={!loading || !isValidating}
              />
            </View>
            
            {/* Validation Status */}
            {isValid !== null && (
              <View className="flex-row items-center justify-center mt-2">
                <MaterialIcons
                  name={isValid ? "check-circle" : "error"}
                  size={16}
                  color={isValid ? "#10b981" : "#ef4444"}
                  className="mr-2"
                />
                <Text className={`text-sm ${isValid ? "text-green-500" : "text-red-500"}`}>
                  {isValid ? "Valid organization code" : "Invalid organization code"}
                </Text>
              </View>
            )}
          </View>

          {/* Validate Button */}
          <TouchableOpacity
            className={`py-4 rounded-full items-center mb-4 shadow-lg ${
              isValidating || !code.trim()
                ? "bg-gray-300"
                : "bg-blue-500"
            }`}
            onPress={handleValidateCode}
            disabled={isValidating || !code.trim()}
          >
            {isValidating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-xl font-bold">Validate Code</Text>
            )}
          </TouchableOpacity>

          {/* Help Text */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="text-gray-600 text-sm text-center">
              <MaterialIcons name="info" size={16} color="#6b7280" /> Enter the organization code provided by your organization president to join.
            </Text>
          </View>

          {/* Back Button */}
          <View className="flex-row justify-center items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-gray-500 text-base">
                Already have an organization?{" "}
                <Text className="text-green-500 font-bold">Go Back</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
