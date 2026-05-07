import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <StatusBar style="dark" />
      
      {/* Hero Section */}
      <View className="flex-[1.5] justify-center items-center">
        <Image 
          source={require("../../assets/images/welcome.png")} 
          className="w-5/6 h-3/4" 
          resizeMode="contain" 
        />
        {/* Pagination Dots */}
        <View className="flex-row mt-5">
          <View className="w-5 h-2 rounded-sm bg-green-400 mx-1" />
          <View className="w-2 h-2 rounded-full bg-gray-200 mx-1" />
          <View className="w-2 h-2 rounded-full bg-gray-200 mx-1" />
        </View>
      </View>

      {/* Content Section */}
      <View className="flex-1 items-center px-10">
        <Text className="text-[34px] text-gray-700 text-center leading-[45px] mb-10">
          {"Enjoy your\nLife with"} <Text className="font-bold text-gray-900">Plants</Text>
        </Text>

        {/* Circular Arrow Button */}
        <TouchableOpacity 
          className="bg-green-400 w-[70px] h-[70px] rounded-[35px] justify-center items-center shadow-lg shadow-black/20"
          onPress={() => router.replace("/login")}
        >
          <Ionicons name="arrow-forward" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
