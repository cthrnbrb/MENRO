import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/src/context/auth-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function CodeScreen() {
  const router = useRouter();
  const { joinOrganization, loading } = useAuth();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleJoinOrganization = async () => {
    if (!code.trim()) {
      setError("Please enter your organization code");
      return;
    }

    try {
      setError("");
      await joinOrganization({ code });
    } catch (e) {
      setError("Failed to join organization. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-emerald-50 to-white">
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Hero Section */}
        <View className="flex-1 justify-center items-center px-8">
          <View className="relative justify-center items-center">
            {/* Background Circle */}
            <View className="absolute w-48 h-48 bg-emerald-100 rounded-full blur-3xl opacity-40 -z-10" />

            <Image
              source={require("../../assets/images/code.png")}
              className="w-80 h-60"
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text className="text-3xl font-bold text-gray-800 text-center mt-6 mb-2">
            Join Organization
          </Text>

          <Text className="text-gray-600 text-center text-lg leading-6 px-4 mb-6">
            Enter your organization code to join as an Organization Planter
          </Text>

          {/* Code Input */}
          <View className="w-full mb-8">
            <View className="relative">
              <TextInput
                className="bg-white border-2 border-gray-200 rounded-2xl px-12 py-4 text-xl text-center font-mono text-gray-800 shadow-lg"
                placeholder="Enter code"
                placeholderTextColor="#9CA3AF"
                value={code}
                onChangeText={(text) => {
                  setCode(text.toUpperCase());
                  if (error) setError("");
                }}
                maxLength={20}
                autoCapitalize="characters"
                textAlign="center"
                editable={!loading}
              />

              {/* Lock Icon */}
              <View className="absolute left-4 top-1/2 -translate-y-1/2">
                <MaterialIcons name="lock" size={20} color="#6B7280" />
              </View>
            </View>

            {/* Error Message */}
            {error && (
              <View className="flex-row items-center justify-center mt-3">
                <MaterialIcons
                  name="error-outline"
                  size={16}
                  color="#EF4444"
                  className="mr-2"
                />
                <Text className="text-red-500 text-sm font-medium">
                  {error}
                </Text>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={
              loading || !code.trim()
                ? "py-4 rounded-full items-center shadow-md w-full mb-4 bg-gray-200 border border-gray-300"
                : "py-4 rounded-full items-center shadow-md w-full mb-4 bg-emerald-500 border border-emerald-600 shadow-emerald-100"
            }
            onPress={handleJoinOrganization}
            disabled={loading || !code.trim()}
          >
            {loading ? (
              <ActivityIndicator color="white" size="large" />
            ) : (
              <Text className="text-white text-lg font-semibold">
                Join Organization
              </Text>
            )}
          </TouchableOpacity>

          {/* Help Text */}
          <View className="flex-row justify-center items-center mt-6">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-gray-500 text-base">
                <Text className="text-emerald-600 font-semibold">Back</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
