import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { getToken } from "@/src/services/auth-storage";
import axios from "@/src/api/axios";
import PresidentFooter from "@/src/components/PresidentFooter";

export default function PresidentGeoTagTreeScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to geo-tag trees.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      Alert.alert("Error", "Failed to get current location.");
      console.error(error);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Camera permission is required to take photos.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'] as any,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo.");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!location) {
      Alert.alert("Error", "Location is required.");
      return;
    }

    if (!photo) {
      Alert.alert("Error", "Photo is required.");
      return;
    }

    try {
      setLoading(true);
      
      // Convert photo to Base64
      const response = await fetch(photo);
      const blob = await response.blob();
      const base64data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
        
      // Create JSON payload
      const treeData = {
        activity_id: 2,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        photo: base64data,
      };

      const apiResponse = await axios.post('/trees', treeData);

      if (apiResponse.data) {
        Alert.alert("Success", "Tree geo-tagged successfully!", [
          { text: "OK", onPress: () => router.push("/organization/president/home" as any) },
        ]);
      }
    } catch (error: any) {
      console.error("Geo-tag error:", error);
      if (error.response?.data) {
        Alert.alert("Error", error.response.data.message || JSON.stringify(error.response.data));
      } else {
        Alert.alert("Error", "Failed to geo-tag tree. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerSubtitle}>Add a new tree to the system</Text>
          </View>

          {/* Location Display */}
          <View style={styles.section}>
            <View style={styles.locationCard}>
              <MaterialIcons name="location-on" size={24} color="#10b981" />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Current Location</Text>
                {location ? (
                  <Text style={styles.locationText}>
                    {location.coords.latitude.toFixed(7)}, {location.coords.longitude.toFixed(7)}
                  </Text>
                ) : (
                  <Text style={styles.locationText}>Getting location...</Text>
                )}
              </View>
              <TouchableOpacity onPress={getCurrentLocation} style={styles.refreshButton}>
                <FontAwesome name="refresh" size={20} color="#10b981" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Photo Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tree Photo</Text>
            <TouchableOpacity onPress={pickImage} style={styles.photoCard}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photoPreview} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <MaterialIcons name="camera-alt" size={48} color="#999" />
                  <Text style={styles.photoPlaceholderText}>Take Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Geo-Tag Tree</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <PresidentFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f0fdf4",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#166534",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  locationText: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "500",
  },
  refreshButton: {
    padding: 8,
  },
  photoCard: {
    height: 200,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholderText: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
  },
  submitButton: {
    margin: 20,
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
