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
import { getToken, setToken } from "@/src/services/auth-storage";
import * as ImagePicker from 'expo-image-picker';
import axios from "@/src/api/axios";
import MonitoringNavFooter from "@/src/components/MonitoringNavFooter";

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

export default function MonitoringProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
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
      const response = await axios.get('/user/profile');
      setUser(response.data.data.user);
      setPhoto(response.data.data.user.photo || null);
      setEditForm({
        first_name: response.data.data.user.first_name,
        middle_name: response.data.data.user.middle_name || "",
        last_name: response.data.data.user.last_name,
        contact_number: response.data.data.user.contact_number,
        address: response.data.data.user.address,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to fetch profile");
      console.error(error);
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
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  const API_BASE = axios.defaults.baseURL?.replace(/\/api$/, "") || "http://192.168.1.2:8000";

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
      padding: 40,
    },
    errorText: {
      fontSize: 18,
      color: "#6b7280",
      marginTop: 16,
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
      backgroundColor: "rgba(0,0,0,0.3)",
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
    section: {
      padding: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#1f2937",
    },
    editButton: {
      padding: 8,
    },
    infoCard: {
      backgroundColor: "#fff",
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    infoContent: {
      flex: 1,
      marginLeft: 12,
    },
    infoLabel: {
      fontSize: 12,
      color: "#6b7280",
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 14,
      color: "#1f2937",
      fontWeight: "500",
    },
    editRow: {
      marginBottom: 16,
    },
    editLabel: {
      fontSize: 12,
      color: "#6b7280",
      marginBottom: 4,
    },
    editInput: {
      backgroundColor: "#f9fafb",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      fontSize: 14,
      color: "#1f2937",
    },
    editActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 8,
    },
    cancelButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      borderRadius: 8,
      backgroundColor: "#f3f4f6",
    },
    cancelButtonText: {
      color: "#6b7280",
      fontSize: 14,
      fontWeight: "500",
    },
    saveButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: "#10b981",
    },
    saveButtonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "500",
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      margin: 20,
      backgroundColor: "#fef2f2",
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
    notificationContainer: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    settingsList: {
      gap: 0,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
    },
    settingLabel: {
      fontSize: 14,
      color: '#1f2937',
    },
    helpList: {
      gap: 0,
    },
    helpItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
    },
    helpLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
    },
    helpLabel: {
      fontSize: 14,
      color: '#1f2937',
    },
    seeAllButton: {
      marginLeft: 'auto',
    },
    seeAllText: {
      fontSize: 12,
      color: '#10b981',
      fontWeight: '500',
    },
  });

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
                        uri: photo.startsWith("http") || photo.startsWith("file://")
                          ? photo
                          : `${API_BASE}/${photo}`,
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
                    style={styles.editInput}
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

        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/monitoring/settings')}>
              <View style={styles.settingLeft}>
                <MaterialIcons name="notifications" size={20} color="#6b7280" />
                <Text style={styles.settingLabel}>Notifications</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/monitoring/settings')}>
              <View style={styles.settingLeft}>
                <MaterialIcons name="lock" size={20} color="#6b7280" />
                <Text style={styles.settingLabel}>Privacy & Security</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/monitoring/settings')}>
              <View style={styles.settingLeft}>
                <MaterialIcons name="language" size={20} color="#6b7280" />
                <Text style={styles.settingLabel}>Language</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/monitoring/settings')}>
              <View style={styles.settingLeft}>
                <MaterialIcons name="help-outline" size={20} color="#6b7280" />
                <Text style={styles.settingLabel}>Help & Support</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Help & Support</Text>
          </View>
          <View style={styles.helpList}>
            <TouchableOpacity style={styles.helpItem}>
              <View style={styles.helpLeft}>
                <MaterialIcons name="menu-book" size={20} color="#10b981" />
                <Text style={styles.helpLabel}>User Guide</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpItem}>
              <View style={styles.helpLeft}>
                <MaterialIcons name="contact-support" size={20} color="#10b981" />
                <Text style={styles.helpLabel}>Contact Support</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpItem}>
              <View style={styles.helpLeft}>
                <MaterialIcons name="info" size={20} color="#10b981" />
                <Text style={styles.helpLabel}>About</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <MonitoringNavFooter />
    </View>
);

}
