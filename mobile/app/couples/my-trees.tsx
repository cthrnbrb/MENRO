import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
  RefreshControl,
  TextInput,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { getToken } from "@/src/services/auth-storage";
import { useCallback } from "react";
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
  synced_at: string;
  status: 'alive' | 'dead';
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  photo?: string;
}

interface Organization {
  id: number;
  org_name: string;
  organization_code: string;
}

interface Statistics {
  total_trees: number;
  alive_trees: number;
  dead_trees: number;
  survival_rate: number;
}

export default function CoupleMyTreesScreen() {
  const router = useRouter();
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  useEffect(() => {
    fetchUserProfile();
    fetchTrees();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/user/profile');

      if (response.data) {
        setUser(response.data.data.user);
        setOrganization(response.data.data.organization);
        setStatistics(response.data.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchTrees = async () => {
    try {
      const response = await axios.get('/trees/my-trees');
      setTrees(response.data.data || []);
    } catch (error) {
      console.error("Error fetching trees:", error);
      setTrees([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrees();
  };

  const handleTreePress = (tree: Tree) => {
    router.push(`/planters/tree-details?id=${tree.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getCurrentQuarter = () => {
    const month = new Date().getMonth() + 1;
    if (month <= 3) return 'Q1';
    if (month <= 6) return 'Q2';
    if (month <= 9) return 'Q3';
    return 'Q4';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your trees...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                onPress={() => router.push("/planters/profile")}
                style={styles.profileImageContainer}
              >
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
                    <MaterialIcons name="person" size={32} color="#9ca3af" />
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>Good Morning,</Text>
                <Text style={styles.userName}>{user?.first_name}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Banner Section */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>MENRO</Text>
              <Text style={styles.bannerSubtitle}>
                Quarterly Tree Updates - {getCurrentQuarter()}
              </Text>
            </View>
            <View style={styles.bannerImageContainer}>
              <Image
                source={require("@/assets/images/tree_banner.png")}
                style={styles.bannerImage}
              />
            </View>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {statistics?.total_trees || 0}
            </Text>
            <Text style={styles.statLabel}>Total Trees</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {statistics?.alive_trees || 0}
            </Text>
            <Text style={styles.statLabel}>Alive</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{statistics?.dead_trees || 0}</Text>
            <Text style={styles.statLabel}>Dead</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {statistics?.survival_rate || 0}%
            </Text>
            <Text style={styles.statLabel}>Survival Rate</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>
            How to Update Tree Status
          </Text>
          <Text style={styles.instructionsText}>
            1. Tap on any tree below to take a photo
          </Text>
          <Text style={styles.instructionsText}>
            2. The photo will be sent for admin validation
          </Text>
          <Text style={styles.instructionsText}>
            3. Admin will determine if the tree is alive or dead
          </Text>
          <Text style={styles.instructionsText}>
            4. You can update once per quarter
          </Text>
        </View>

        {/* Trees List */}
        <View style={styles.treesSection}>
          <Text style={styles.sectionTitle}>Your Trees</Text>
          {trees.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="eco" size={64} color="#9ca3af" />
              <Text style={styles.emptyText}>No trees planted yet</Text>
            </View>
          ) : (
            trees.map((tree) => (
              <TouchableOpacity
                key={tree.id}
                style={styles.treeCard}
                onPress={() => handleTreePress(tree)}
              >
                <View style={styles.treeCardLeft}>
                  {tree.photo ? (
                    <Image
                      source={{
                        uri: tree.photo.startsWith("http")
                          ? tree.photo
                          : `http://192.168.1.16:8000/${tree.photo}`,
                      }}
                      style={styles.treePhoto}
                    />
                  ) : (
                    <View style={styles.treePhotoPlaceholder}>
                      <MaterialIcons name="park" size={32} color="#4CAF50" />
                    </View>
                  )}
                  <View style={styles.treeInfo}>
                    <Text style={styles.treeSpecies}>{tree.tree_species}</Text>
                    <Text style={styles.treeDate}>
                      Planted: {formatDate(tree.planted_at)}
                    </Text>
                    <Text style={styles.treeLocation}>
                      {tree.latitude.toFixed(4)}, {tree.longitude.toFixed(4)}
                    </Text>
                  </View>
                </View>
                <View style={styles.treeCardRight}>
                  <TouchableOpacity style={styles.detailsButton} onPress={() => handleTreePress(tree)}>
                    <MaterialIcons name="location-on" size={20} color="#2196F3" />
                    <Text style={styles.buttonText}>Details</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#4CAF50",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  greetingContainer: {
    flexDirection: "column",
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  bannerContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bannerContent: {
    flexDirection: "row",
    padding: 16,
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  bannerImageContainer: {
    width: 80,
    height: 80,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  instructionsContainer: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  treesSection: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 12,
  },
  treeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  treeCardLeft: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  treePhoto: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  treePhotoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
  },
  treeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  treeSpecies: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  treeDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  treeLocation: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  treeCardRight: {
    justifyContent: "center",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
});
