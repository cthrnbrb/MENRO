import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/src/context/auth-context";
import {
  validateRegisterForm,
  RegisterFormData,
  ValidationErrors,
} from "@/src/utils/validation";
import { MaterialIcons, FontAwesome, AntDesign } from "@expo/vector-icons";
import axios from "@/src/api/axios";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  const router = useRouter();
  const { register, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    contact_number: "",
    address: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    const newErrors = validateRegisterForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Alert.alert("Validation Error", "Please fill the empty fields.");
      return;
    }

    // Additional validation to ensure password exists
    if (!formData.password || formData.password.trim() === '') {
      Alert.alert("Validation Error", "Password is required.");
      return;
    }

    if (!formData.password_confirmation || formData.password_confirmation.trim() === '') {
      Alert.alert("Validation Error", "Password confirmation is required.");
      return;
    }

    try {
      await register(formData);
    } catch (error) {
      // Error already handled by auth context with Alert
      console.error("Register error:", error);
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const isLoading = authLoading;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View className="items-center overflow-hidden" style={{ height: 300 }}>
            <View
              className="absolute"
              style={{
                width: width * 1.8,
                height: width * 1.8,
                borderRadius: (width * 1.8) / 2,
                top: -width * 1.15,
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Image
                source={require("@/assets/images/cover.jpg")}
                style={{ width: width, height: 240 }}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* SECTION: REGISTER FORM */}
          <View className="px-8 pt-6">
            <Text className="text-4xl font-bold text-green-600 mb-1 text-center">
              Register
            </Text>

            <Text className="text-gray-500 text-lg text-center mb-4">
              Create your new account
            </Text>

          {/* First Name */}
          <View className="mb-4">
            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm">
              <MaterialIcons
                name="person"
                size={24}
                color="#999"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-lg text-gray-800"
                placeholder="First Name"
                placeholderTextColor="#999"
                value={formData.first_name}
                onChangeText={(text) => {
                  setFormData({ ...formData, first_name: text });
                  clearError("first_name");
                }}
              />
            </View>
            {errors.first_name && (
              <Text className="text-red-500 text-[10px] mt-1 ml-4">
                {errors.first_name}
              </Text>
            )}
          </View>

          {/* Middle Name */}
          <View className="mb-4">
            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm">
              <MaterialIcons
                name="person"
                size={24}
                color="#999"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-lg text-gray-800"
                placeholder="Middle Name"
                placeholderTextColor="#999"
                value={formData.middle_name}
                onChangeText={(text) => {
                  setFormData({ ...formData, middle_name: text });
                  clearError("middle_name");
                }}
              />
            </View>
            {errors.middle_name && (
              <Text className="text-red-500 text-[10px] mt-1 ml-4">
                {errors.middle_name}
              </Text>
            )}
          </View>

          {/* Last Name */}
          <View className="mb-4">
            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm">
              <MaterialIcons
                name="person"
                size={24}
                color="#999"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-lg text-gray-800"
                placeholder="Last Name"
                placeholderTextColor="#999"
                value={formData.last_name}
                onChangeText={(text) => {
                  setFormData({ ...formData, last_name: text });
                  clearError("last_name");
                }}
              />
            </View>
            {errors.last_name && (
              <Text className="text-red-500 text-[10px] mt-1 ml-4">
                {errors.last_name}
              </Text>
            )}
          </View>

          {/* Email */}
          <View className="mb-4">
            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm">
              <MaterialIcons
                name="email"
                size={24}
                color="#999"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-lg text-gray-800"
                placeholder="Email Address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  clearError("email");
                }}
              />
            </View>
            {errors.email && (
              <Text className="text-red-500 text-[10px] mt-1 ml-4">
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password */}
          <View className="mb-4">
            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm">
              <MaterialIcons
                name="lock"
                size={24}
                color="#999"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-lg text-gray-800"
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => {
                  setFormData({ ...formData, password: text });
                  clearError("password");
                  clearError("password_confirmation");
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={24}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500 text-[10px] mt-1 ml-4">
                {errors.password}
              </Text>
            )}
          </View>

          {/* Confirm Password */}
          <View className="mb-4">
            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm">
              <MaterialIcons
                name="lock"
                size={24}
                color="#999"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-lg text-gray-800"
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                value={formData.password_confirmation}
                onChangeText={(text) => {
                  setFormData({ ...formData, password_confirmation: text });
                  clearError("password_confirmation");
                }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <MaterialIcons
                  name={showConfirmPassword ? "visibility-off" : "visibility"}
                  size={24}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            {errors.password_confirmation && (
              <Text className="text-red-500 text-[10px] mt-1 ml-4">
                {errors.password_confirmation}
              </Text>
            )}
          </View>

          {/* Contact */}
          <View className="mb-4">
            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm">
              <MaterialIcons
                name="phone"
                size={24}
                color="#999"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-lg text-gray-800"
                placeholder="Contact Number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={formData.contact_number}
                onChangeText={(text) => {
                  setFormData({ ...formData, contact_number: text });
                  clearError("contact_number");
                }}
              />
            </View>
            {errors.contact_number && (
              <Text className="text-red-500 text-[10px] mt-1 ml-4">
                {errors.contact_number}
              </Text>
            )}
          </View>

          {/* Address */}
          <View className="mb-8">
            <View className="flex-row items-start bg-white rounded-2xl px-6 py-5 border border-gray-100 shadow-sm">
              <MaterialIcons
                name="location-on"
                size={24}
                color="#999"
                className="mr-3 mt-1"
              />
              <TextInput
                className="flex-1 text-lg text-gray-800 h-24"
                placeholder="Address"
                placeholderTextColor="#999"
                multiline
                textAlignVertical="top"
                value={formData.address}
                onChangeText={(text) => {
                  setFormData({ ...formData, address: text });
                  clearError("address");
                }}
              />
            </View>
            {errors.address && (
              <Text className="text-red-500 text-[10px] mt-1 ml-4">
                {errors.address}
              </Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className={`py-4 rounded-full items-center mb-6 shadow-lg ${
              isLoading ? "bg-green-300" : "bg-green-500"
            }`}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-xl font-bold">Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* SIGN IN */}
          <View className="flex-row justify-center items-center mt-3 mb-14">
            <Text className="text-base text-gray-400">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text className="text-base text-green-500 font-bold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}