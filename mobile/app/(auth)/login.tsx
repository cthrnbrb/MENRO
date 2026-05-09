import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/src/context/auth-context";
import { validateLoginForm, LoginFormData } from "@/src/utils/validation";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors = validateLoginForm(formData as LoginFormData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(formData);
    } catch (error) {
      // Error handled in context
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Status Bar */}
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View
            className="items-center overflow-hidden"
            style={{ height: 300 }}
          >
            <View
              className="bg-gray-100 absolute"
              style={{
                width: width * 1.8,
                height: width * 1.8,
                borderRadius: (width * 1.8) / 2,
                top: -width * 1.1,
                overflow: "hidden",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../assets/images/cover.jpg")}
                style={{ width: width, height: 280 }}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* FORM */}
          <View className="px-8 pt-8">
            <Text className="text-4xl font-bold text-green-600 mb-1 text-center">
              Log In
            </Text>

            <Text className="text-gray-500 text-lg text-center mb-10">
              Log in to your account
            </Text>

            {/* EMAIL */}
            <View className="mb-5">
              <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm shadow-gray-200">
                <MaterialIcons
                  name="email"
                  size={24}
                  color="#C7C7CD"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-lg text-gray-800"
                  placeholder="Email"
                  placeholderTextColor="#C7C7CD"
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData({ ...formData, email: text });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {errors.email && (
                <Text className="text-red-500 text-[10px] mt-1 ml-5">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* PASSWORD */}
            <View className="mb-6">
              <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm shadow-gray-200">
                <MaterialIcons
                  name="lock"
                  size={24}
                  color="#C7C7CD"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-lg text-gray-800"
                  placeholder="Password"
                  placeholderTextColor="#C7C7CD"
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData({ ...formData, password: text });
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility-off" : "visibility"}
                    size={24}
                    color="#C7C7CD"
                  />
                </TouchableOpacity>
              </View>

              {errors.password && (
                <Text className="text-red-500 text-[10px] mt-1 ml-5">
                  {errors.password}
                </Text>
              )}
            </View>

            {/* REMEMBER + FORGOT */}
            <View className="flex-row justify-between items-center mb-10 px-1">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View className="w-5 h-5 border-2 border-gray-400 rounded mr-2 items-center justify-center">
                  <Text className="text-transparent">
                    {rememberMe ? "✓" : " "}
                  </Text>
                </View>
                <Text className="text-base text-gray-500 font-medium">
                  Remember me
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text className="text-base text-gray-400">
                  Forget Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity
              className={`py-4 rounded-full items-center mb-5 shadow-lg shadow-green-200 ${
                loading ? "bg-green-300" : "bg-green-500"
              }`}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-xl font-bold">Log In</Text>
              )}
            </TouchableOpacity>

            {/* SIGN UP */}
            <View className="flex-row justify-center items-center mt-8 mb-10">
              <Text className="text-base text-gray-400">
                Don&apos;t have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text className="text-base text-green-500 font-bold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
