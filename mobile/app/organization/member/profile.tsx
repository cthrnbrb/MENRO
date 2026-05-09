import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TextInput,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { setToken } from "@/src/services/auth-storage";
import * as ImagePicker from 'expo-image-picker';
import MemberFooter from "../../../src/components/MemberFooter";
import axios from "@/src/api/axios";

interface User {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  address: string;
  role: string;
  created_at: string;
  photo?: string;
}

interface Organization {
  id: number;
  org_name: string;
  president_id?: number;
  organization_code: string;
  president?: {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
  };
}

interface Statistics {
  total_trees: number;
  alive_trees: number;
  dead_trees: number;
  survival_rate: number;
  last_planted: string;
}

export default function MemberProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    contact_number: "",
    address: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/user/profile");
      
      if (response.data && response.data.data) {
        setUser(response.data.data.user);
        setOrganization(response.data.data.organization);
        setStatistics(response.data.data.statistics);
        setPhoto(response.data.data.user.photo || null);
        
        const userData = response.data.data.user;
        setEditForm({
          first_name: userData.first_name || "",
          middle_name: userData.middle_name || "",
          last_name: userData.last_name || "",
          contact_number: userData.contact_number || "",
          address: userData.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      setEditForm({
        first_name: user.first_name,
        middle_name: user.middle_name || "",
        last_name: user.last_name,
        contact_number: user.contact_number,
        address: user.address,
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('/user/profile', editForm);
      setUser(response.data.data);
      setEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
      console.error(error);
    }
  };

  const handleSavePhoto = async () => {
    if (!photo || photo === user?.photo) {
      Alert.alert("Info", "Please select a photo first");
      return;
    }

    try {
      const formData = new FormData();
      const uri = photo;
      const filename = uri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('photo', {
        uri,
        name: filename,
        type,
      } as any);

      const response = await axios.post('/user/profile/photo', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(response.data.data);
      setPhoto(response.data.data.photo || null);
      Alert.alert("Success", "Photo updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update photo");
      console.error(error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await setToken(null);
            router.replace("/login");
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color="#ef4444" />
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ImageBackground
          source={require("@/assets/images/forest1.jpg")}
          style={styles.header}
          imageStyle={styles.headerImage}
        >
          <View style={styles.headerOverlay}>
            <View style={styles.headerTopBar}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <MaterialIcons name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>My Profile</Text>
              <View style={{ width: 28 }} />
            </View>
            <View style={styles.headerContent}>
              <View style={styles.avatarWrapper}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.avatarContainer}
              >
                {photo ? (
                  <Image
                    source={{
                      uri: photo.startsWith("http")
                        ? photo
                        : `http://192.168.1.16:8000/${photo}`,
                    }}
                    style={styles.avatar}
                  />
                ) : (
                  <ImageBackground
                    source={require("@/assets/images/forest1.jpg")}
                    style={styles.avatarPlaceholder}
                    imageStyle={{ borderRadius: 60 }}
                  >
                    <View style={styles.avatarOverlay}>
                      <MaterialIcons name="person" size={48} color="#fff" />
                    </View>
                  </ImageBackground>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.photoEditButton}
              >
                <MaterialIcons name="edit" size={16} color="white" />
              </TouchableOpacity>
              {photo && photo !== user?.photo && (
                <TouchableOpacity
                  onPress={handleSavePhoto}
                  style={styles.savePhotoButton}
                >
                  <MaterialIcons name="check" size={16} color="white" />
                  <Text style={styles.savePhotoButtonText}>Save Photo</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.headerName}>
              {user.first_name} {user.last_name}
            </Text>
            <Text style={styles.headerRole}>{user.role}</Text>
          </View>
          </View>
        </ImageBackground>

        {/* Statistics */}
        {statistics && (
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <MaterialIcons name="park" size={24} color="#10b981" />
              <Text style={styles.statValue}>{statistics.total_trees}</Text>
              <Text style={styles.statLabel}>Total Trees</Text>
            </View>
            <View style={styles.statCard}>
              <FontAwesome name="check-circle" size={24} color="#10b981" />
              <Text style={styles.statValue}>{statistics.alive_trees}</Text>
              <Text style={styles.statLabel}>Alive</Text>
            </View>
            <View style={styles.statCard}>
              <FontAwesome name="times-circle" size={24} color="#ef4444" />
              <Text style={styles.statValue}>{statistics.dead_trees}</Text>
              <Text style={styles.statLabel}>Dead</Text>
            </View>
            <View style={styles.statCard}>
              <FontAwesome name="heartbeat" size={24} color="#10b981" />
              <Text style={styles.statValue}>{statistics.survival_rate}%</Text>
              <Text style={styles.statLabel}>Survival Rate</Text>
            </View>
          </View>
        )}

        {/* Organization Info */}
        {organization && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Organization</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <MaterialIcons name="business" size={20} color="#6b7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Organization Name</Text>
                  <Text style={styles.infoValue}>{organization.org_name}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="code" size={20} color="#6b7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Organization Code</Text>
                  <Text style={styles.infoValue}>
                    {organization.organization_code}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {!editing && (
              <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                <MaterialIcons name="edit" size={20} color="#10b981" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoCard}>
            {editing ? (
              <>
                <View style={styles.editRow}>
                  <Text style={styles.editLabel}>First Name</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editForm.first_name}
                    onChangeText={(text) =>
                      setEditForm({ ...editForm, first_name: text })
                    }
                  />
                </View>
                <View style={styles.editRow}>
                  <Text style={styles.editLabel}>Middle Name</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editForm.middle_name}
                    onChangeText={(text) =>
                      setEditForm({ ...editForm, middle_name: text })
                    }
                  />
                </View>
                <View style={styles.editRow}>
                  <Text style={styles.editLabel}>Last Name</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editForm.last_name}
                    onChangeText={(text) =>
                      setEditForm({ ...editForm, last_name: text })
                    }
                  />
                </View>
                <View style={styles.editRow}>
                  <Text style={styles.editLabel}>Contact Number</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editForm.contact_number}
                    onChangeText={(text) =>
                      setEditForm({ ...editForm, contact_number: text })
                    }
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.editRow}>
                  <Text style={styles.editLabel}>Address</Text>
                  <TextInput
                    style={[styles.editInput, styles.editInputMultiline]}
                    value={editForm.address}
                    onChangeText={(text) =>
                      setEditForm({ ...editForm, address: text })
                    }
                    multiline
                  />
                </View>
                <View style={styles.editActions}>
                  <TouchableOpacity
                    onPress={handleCancel}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSave}
                    style={styles.saveButton}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <MaterialIcons name="person" size={20} color="#6b7280" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Full Name</Text>
                    <Text style={styles.infoValue}>
                      {user.first_name} {user.middle_name} {user.last_name}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <MaterialIcons name="email" size={20} color="#6b7280" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{user.email}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <MaterialIcons name="phone" size={20} color="#6b7280" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Contact Number</Text>
                    <Text style={styles.infoValue}>{user.contact_number}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <MaterialIcons name="location-on" size={20} color="#6b7280" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Address</Text>
                    <Text style={styles.infoValue}>{user.address}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <MaterialIcons name="event" size={20} color="#6b7280" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Member Since</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(user.created_at)}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <MemberFooter />
    </View>
  );
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ef4444",
  },
  header: {
    width: "100%",
    height: 280,
  },
  headerImage: {
    resizeMode: "cover",
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  headerContent: {
    alignItems: "center",
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
  },
  avatar: {
    width: 120,
    height: 120,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
  },
  avatarOverlay: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(73, 99, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  photoEditButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#10b981",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  savePhotoButton: {
    position: "absolute",
    bottom: -40,
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  savePhotoButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  headerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerRole: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  statsSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20,
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  editButton: {
    padding: 8,
  },
  infoCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
  editRow: {
    marginBottom: 16,
  },
  editLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  editInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1f2937",
  },
  editInputMultiline: {
    height: 80,
    textAlignVertical: "top",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#6b7280",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef2f2",
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  logoutButtonText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
