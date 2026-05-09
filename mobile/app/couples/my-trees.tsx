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
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { getToken } from "@/src/services/auth-storage";
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
  status: "alive" | "dead";
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
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile(true); // Show loading on initial mount
    fetchTrees();
  }, []);

  // Data is loaded once on mount and persisted
  // No need to refetch on focus - this prevents state clearing when navigating back

  const fetchUserProfile = async (showLoading = false) => {
    // Only show loading on initial fetch, not on background refresh
    if (showLoading && !user) {
      setProfileLoading(true);
    }

    try {
      const response = await axios.get("/user/profile");
      console.log("Profile response:", response.data);

      if (response.data && response.data.data) {
        console.log("Setting user:", response.data.data.user);
        setUser(response.data.data.user);
        setOrganization(response.data.data.organization);
        setStatistics(response.data.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Don't clear existing user data on error - keep previous state
      // This ensures UI remains visible even if fetch fails
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchTrees = async () => {
    try {
      const response = await axios.get("/trees/my-trees");
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

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                onPress={() => router.push("/couples/profile")}
                style={styles.profileImageContainer}
              >
                {profileLoading ? (
                  <View style={styles.profileImagePlaceholder}>
                    <ActivityIndicator size="small" color="#10b981" />
                  </View>
                ) : user?.photo ? (
                  <Image
                    source={{
                      uri: user.photo.startsWith("http")
                        ? user.photo
                        : `http://192.168.1.2:8000/${user.photo}`,
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
                {profileLoading ? (
                  <Text style={styles.welcomeText}>Welcome, Guest</Text>
                ) : (
                  <Text style={styles.welcomeText}>
                    Welcome, {user?.first_name || "Guest"}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.logosContainer}>
              <Image
                source={require("@/assets/images/OpolLogo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Image
                source={require("@/assets/images/menrologo.jpg")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Banner Section */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>MENRO</Text>
              <Text style={styles.bannerSubtitle}>
                Trees are important in out Ecosystem, it provides protection
              </Text>
            </View>
            <View style={styles.bannerImageContainer}>
              <Image
                source={require("@/assets/images/tree_banner.png")}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Statistics Cards */}
        {(statistics || profileLoading) && (
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Image
                    source={require("@/assets/images/total.png")}
                    style={styles.statIcon}
                  />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Total Trees</Text>
                  <Text style={styles.statValue}>
                    {statistics?.total_trees ?? 0}
                  </Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Image
                    source={require("@/assets/images/rate.png")}
                    style={styles.statIcon}
                  />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Survival Rate</Text>
                  <Text style={styles.statValue}>
                    {statistics?.survival_rate ?? 0}%
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Image
                    source={require("@/assets/images/alive.png")}
                    style={styles.statIcon}
                  />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Alive</Text>
                  <Text style={styles.statValue}>
                    {statistics?.alive_trees ?? 0}
                  </Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Image
                    source={require("@/assets/images/dead.png")}
                    style={styles.statIcon}
                  />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Dead</Text>
                  <Text style={styles.statValue}>
                    {statistics?.dead_trees ?? 0}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Add Tree Button */}
        <TouchableOpacity
          style={styles.addTreeButton}
          onPress={() => router.push("/couples/add-tree")}
        >
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.addTreeButtonText}>Add Tree</Text>
        </TouchableOpacity>

        {/* Send Photo Update Button - Couples specific */}
        <TouchableOpacity
          style={styles.updateTreeButton}
          onPress={() => router.push("/couples/update-tree")}
        >
          <MaterialIcons name="photo-camera" size={24} color="white" />
          <Text style={styles.updateTreeButtonText}>Send Photo Update</Text>
        </TouchableOpacity>

        {/* Trees List Section */}
        <View style={styles.treesSection}>
          <Text style={styles.sectionTitle}>My Trees</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10b981" />
            </View>
          ) : trees.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="park" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>No trees planted yet</Text>
              <Text style={styles.emptySubtext}>
                Start by geo-tagging your first tree
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.treeListScrollView}
              contentContainerStyle={styles.treeListContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {trees.map((tree) => (
                <TouchableOpacity
                  key={tree.id}
                  style={styles.treeCard}
                  onPress={() => handleTreePress(tree)}
                >
                  <View style={styles.treePhotoContainer}>
                    {tree.photo ? (
                      <Image
                        source={{ uri: tree.photo }}
                        style={styles.treePhoto}
                      />
                    ) : (
                      <View style={styles.treePhotoPlaceholder}>
                        <MaterialIcons
                          name="nature"
                          size={32}
                          color="#9ca3af"
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.treeInfo}>
                    <Text style={styles.treeSpecies}>{tree.tree_species}</Text>
                    <View style={styles.treeMeta}>
                      <MaterialIcons
                        name="location-on"
                        size={14}
                        color="#6b7280"
                      />
                      <Text style={styles.treeMetaText}>
                        {tree.latitude.toFixed(4)}, {tree.longitude.toFixed(4)}
                      </Text>
                    </View>
                    <View style={styles.treeMeta}>
                      <MaterialIcons name="event" size={14} color="#6b7280" />
                      <Text style={styles.treeMetaText}>
                        Planted: {formatDate(tree.planted_at)}
                      </Text>
                    </View>
                    <View style={styles.syncStatus}>
                      {tree.synced_at ? (
                        <View style={styles.syncedBadge}>
                          <FontAwesome
                            name="check-circle"
                            size={12}
                            color="#10b981"
                          />
                          <Text style={styles.syncedText}>Synced</Text>
                        </View>
                      ) : (
                        <View style={styles.unsyncedBadge}>
                          <FontAwesome
                            name="hourglass"
                            size={12}
                            color="#f59e0b"
                          />
                          <Text style={styles.unsyncedText}>Pending Sync</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Instructions - Couples specific */}
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
            3. Admin will update tree status based on photo
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
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => handleTreePress(tree)}
                  >
                    <MaterialIcons
                      name="location-on"
                      size={20}
                      color="#2196F3"
                    />
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
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  logosContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  greetingContainer: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  bannerContent: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  bannerImageContainer: {
    width: 120,
    height: 120,
    marginLeft: 16,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  statsContainer: {
    paddingHorizontal: 18,
    marginTop: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "transparent",
    borderStyle: "dashed",
  },
  statIcon: {
    width: 30,
    height: 30,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  addTreeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  addTreeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  updateTreeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  updateTreeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  treesSection: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6b7280",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  treeListScrollView: {
    maxHeight: 400,
  },
  treeListContent: {
    gap: 12,
  },
  treeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  treePhotoContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  treePhoto: {
    width: "100%",
    height: "100%",
  },
  treePhotoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  treeInfo: {
    flex: 1,
  },
  treeSpecies: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  treeMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  treeMetaText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  syncStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  syncedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  syncedText: {
    fontSize: 10,
    color: "#10b981",
    fontWeight: "500",
    marginLeft: 4,
  },
  unsyncedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unsyncedText: {
    fontSize: 10,
    color: "#f59e0b",
    fontWeight: "500",
    marginLeft: 4,
  },
  instructionsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    lineHeight: 20,
  },
});
