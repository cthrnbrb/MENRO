import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import Footer from "@/src/components/Footer";
import axios from "@/src/api/axios";

interface Tree {
  id: number;
  activity_id: number;
  planter_id: number;
  tree_species: string;
  latitude: number;
  longitude: number;
  photo: string;
  planted_at: string;
  status: 'alive' | 'dead';
}

export default function UpdateTreeScreen() {
  const router = useRouter();
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [updatePhoto, setUpdatePhoto] = useState<string | null>(null);
  const [remarks, setRemarks] = useState("");
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTrees();
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Location permission is needed to geo-tag your photo update.');
      return;
    }
    // Get initial location
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);
    } catch (error) {
      console.error("Error getting initial location:", error);
    }
  };

  const fetchTrees = async () => {
    try {
      const response = await axios.get('/trees/my-trees');
      const loadedTrees: Tree[] = response.data.data || [];
      setTrees(loadedTrees);

      // If user already has trees, auto-select the first one so the camera appears immediately.
      // This prevents a "no camera" UX where `selectedTree` stays null.
      setSelectedTree((prev) => (prev ? prev : loadedTrees[0] ?? null));
    } catch (error) {
      console.error("Error fetching trees:", error);
      Alert.alert("Error", "Failed to load your trees");
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUpdatePhoto(result.assets[0].uri);
      // Get current location when photo is taken
      try {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation);
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Location Error", "Could not get your current location. Please ensure GPS is enabled.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedTree) {
      Alert.alert("Error", "Please select a tree to update");
      return;
    }

    if (!updatePhoto) {
      Alert.alert("Error", "Please provide a photo update");
      return;
    }

    if (!location) {
      Alert.alert("Error", "Location is required. Please enable GPS and try again.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      
      // Add photo
      const uri = updatePhoto;
      const filename = uri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('photo', {
        uri,
        name: filename,
        type,
      } as any);

      // Add other data
      formData.append('tree_id', selectedTree.id.toString());
      formData.append('latitude', location.coords.latitude.toString());
      formData.append('longitude', location.coords.longitude.toString());
      formData.append('remarks', remarks);

      const response = await axios.post('/trees/photo-update', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert(
        "Success",
        "Your photo update has been submitted for validation. Monitoring staff will review it and update the tree status accordingly.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Error submitting update:", error);
      Alert.alert("Error", "Failed to submit photo update. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Loading your trees...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTopBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Send Photo Update</Text>
            <View style={{ width: 28 }} />
          </View>
        </View>

        {/* Instructions */}
        {/* <View style={styles.instructionsCard}>
          <MaterialIcons name="info" size={24} color="#3b82f6" />
          <Text style={styles.instructionsText}>
            Send photo updates of your trees for monitoring validation. Each update should include a current photo and will be geo-tagged with your location.
          </Text>
        </View> */}

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Capture Tree Photo</Text>

          {/* Location & Timestamp Info */}
          <View style={styles.geoInfoCard}>
            <View style={styles.geoInfoRow}>
              <MaterialIcons name="location-on" size={18} color="#10b981" />
              <Text style={styles.geoInfoText}>
                {location
                  ? `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`
                  : 'Getting location...'}
              </Text>
            </View>
            <View style={styles.geoInfoRow}>
              <MaterialIcons name="access-time" size={18} color="#3b82f6" />
              <Text style={styles.geoInfoText}>
                {new Date().toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Camera Button OR Captured Photo Preview */}
          {!updatePhoto ? (
            <TouchableOpacity
              style={styles.mainCameraButton}
              onPress={takePhoto}
            >
              <View style={styles.cameraIconContainer}>
                <MaterialIcons name="camera-alt" size={48} color="#fff" />
              </View>
              <Text style={styles.mainCameraText}>Open Camera</Text>
              <Text style={styles.mainCameraSubtext}>Tap to capture photo of your tree</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.previewContainer}>
              <View style={styles.previewHeader}>
                <MaterialIcons name="check-circle" size={20} color="#10b981" />
                <Text style={styles.previewTitle}>Photo Captured</Text>
              </View>
              <Image source={{ uri: updatePhoto }} style={styles.photoPreview} />
              {location && (
                <View style={styles.locationInfo}>
                  <MaterialIcons name="location-on" size={16} color="#10b981" />
                  <Text style={styles.locationText}>
                    Location: {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => {
                  setUpdatePhoto(null);
                  // Open camera immediately for retake
                  setTimeout(() => {
                    takePhoto();
                  }, 100);
                }}
              >
                <MaterialIcons name="refresh" size={20} color="#ef4444" />
                <Text style={styles.retakeButtonText}>Retake Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Tree Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Tree to Update</Text>
          {trees.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="park" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No trees found</Text>
              <Text style={styles.emptySubtext}>
                Plant some trees first to send updates
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {trees.map((tree) => (
                <TouchableOpacity
                  key={tree.id}
                  style={[
                    styles.treeCard,
                    selectedTree?.id === tree.id && styles.treeCardSelected,
                  ]}
                  onPress={() => setSelectedTree(tree)}
                >
                  <Image
                    source={{
                      uri: tree.photo.startsWith("http")
                        ? tree.photo
                        : `http://192.168.1.2:8000/${tree.photo}`,
                    }}
                    style={styles.treeImage}
                  />
                  <View style={styles.treeInfo}>
                    <Text style={styles.treeSpecies}>{tree.tree_species}</Text>
                    <Text style={styles.treeDate}>
                      Planted: {new Date(tree.planted_at).toLocaleDateString()}
                    </Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{tree.status}</Text>
                    </View>
                  </View>
                  {selectedTree?.id === tree.id && (
                    <View style={styles.selectedIcon}>
                      <MaterialIcons name="check-circle" size={24} color="#10b981" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Remarks */}
        {updatePhoto && location && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Remarks (Optional)</Text>
            <TextInput
              style={styles.remarksInput}
              multiline
              numberOfLines={4}
              placeholder="Add any notes about the tree's current condition..."
              value={remarks}
              onChangeText={setRemarks}
            />
          </View>
        )}

        {/* Submit Button */}
        {updatePhoto && location && (
          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
              !selectedTree && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialIcons name="send" size={20} color="white" />
                <Text style={styles.submitButtonText}>Submit for Validation</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    backgroundColor: "#10b981",
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  instructionsCard: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  instructionsText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 20,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  treeCard: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  treeCardSelected: {
    borderColor: "#10b981",
    borderWidth: 3,
  },
  treeImage: {
    width: 200,
    height: 120,
  },
  treeInfo: {
    padding: 12,
  },
  treeSpecies: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  treeDate: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  selectedIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  mainCameraButton: {
    backgroundColor: "#10b981",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cameraIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  mainCameraText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  mainCameraSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  geoInfoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  geoInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  geoInfoText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#166534",
    marginLeft: 8,
  },
  warningText: {
    marginTop: 12,
    marginBottom: 12,
    fontSize: 13,
    color: "#b45309",
    backgroundColor: "#fffbeb",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  previewContainer: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  photoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    padding: 12,
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
    gap: 8,
  },
  retakeButtonText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 8,
    backgroundColor: "#f0fdf4",
    borderRadius: 6,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#166534",
  },
  remarksInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1f2937",
    textAlignVertical: "top",
    minHeight: 100,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
