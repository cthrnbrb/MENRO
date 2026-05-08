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
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/src/context/auth-context";
import Footer from "@/src/components/Footer";
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

export default function CoupleProfileScreen() {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useFocusEffect(() => {
    fetchUserProfile();
  });

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/user/profile");
      
      if (response.data) {
        setUser(response.data.data.user);
        setOrganization(response.data.data.organization);
        setStatistics(response.data.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
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
          onPress: () => {
            logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                {user?.photo ? (
                  <Image
                    source={{
                      uri: user.photo.startsWith("http")
                        ? user.photo
                        : `http://192.168.1.52:8000/${user.photo}`,
                    }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <MaterialIcons name="person" size={48} color="#9ca3af" />
                  </View>
                )}
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>
                  {user?.first_name} {user?.middle_name} {user?.last_name}
                </Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{user?.role}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <MaterialIcons name="phone" size={20} color="#6b7280" />
              <Text style={styles.infoText}>{user?.contact_number}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="location-on" size={20} color="#6b7280" />
              <Text style={styles.infoText}>{user?.address}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="event" size={20} color="#6b7280" />
              <Text style={styles.infoText}>
                Member since {user ? formatDate(user.created_at) : ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Organization Information */}
        {organization && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Organization</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <MaterialIcons name="business" size={20} color="#6b7280" />
                <Text style={styles.infoText}>{organization.org_name}</Text>
              </View>
              <View style={styles.infoItem}>
                <MaterialIcons name="code" size={20} color="#6b7280" />
                <Text style={styles.infoText}>{organization.organization_code}</Text>
              </View>
              {organization.president && (
                <View style={styles.infoItem}>
                  <MaterialIcons name="person" size={20} color="#6b7280" />
                  <Text style={styles.infoText}>
                    President: {organization.president.first_name} {organization.president.last_name}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Statistics */}
        {statistics && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tree Statistics</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons name="nature" size={24} color="#10b981" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{statistics.total_trees}</Text>
                  <Text style={styles.statLabel}>Total Trees</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons name="check-circle" size={24} color="#10b981" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{statistics.alive_trees}</Text>
                  <Text style={styles.statLabel}>Alive</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons name="cancel" size={24} color="#ef4444" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{statistics.dead_trees}</Text>
                  <Text style={styles.statLabel}>Dead</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons name="trending-up" size={24} color="#10b981" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{statistics.survival_rate}%</Text>
                  <Text style={styles.statLabel}>Survival Rate</Text>
                </View>
              </View>
            </View>
            {statistics.last_planted && (
              <Text style={styles.lastPlanted}>
                Last planted: {formatDate(statistics.last_planted)}
              </Text>
            )}
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/couples/my-trees")}
            >
              <MaterialIcons name="park" size={24} color="#10b981" />
              <Text style={styles.actionText}>My Trees</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/couples/geo-tag-tree")}
            >
              <MaterialIcons name="add-location" size={24} color="#10b981" />
              <Text style={styles.actionText}>Add Tree</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    marginRight: 16,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  roleText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
  logoutButton: {
    padding: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  lastPlanted: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 12,
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
});
