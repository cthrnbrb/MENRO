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

export default function MyTreesScreen() {
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
    }, []),
  );

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
        {statistics && (
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
                  <Text style={styles.statValue}>{statistics.total_trees}</Text>
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
                    {statistics.survival_rate}%
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
                  <Text style={styles.statValue}>{statistics.alive_trees}</Text>
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
                  <Text style={styles.statValue}>{statistics.dead_trees}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Add Tree Button */}
        <TouchableOpacity
          style={styles.addTreeButton}
          onPress={() => router.push("/planters")}
        >
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.addTreeButtonText}>Add Tree</Text>
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    marginRight: 16,
  },
  profileImage: {
    width: 56,
    height: 56,
  },
  profileImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  greetingContainer: {
    marginLeft: 12,
  },
  greeting: {
    fontSize: 14,
    color: "#6b7280",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
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
  organizationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  orgIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  orgInfo: {
    flex: 1,
  },
  orgLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  orgName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  orgCode: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "500",
  },
  quickActionsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    justifyContent: "space-between",
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  treesSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  treeListScrollView: {
    flex: 1,
  },
  treeListContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#6b7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  treeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  treePhotoContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
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
    marginBottom: 4,
  },
  treeMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  treeMetaText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  syncStatus: {
    marginTop: 8,
  },
  syncedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  syncedText: {
    fontSize: 11,
    color: "#065f46",
    marginLeft: 4,
    fontWeight: "500",
  },
  unsyncedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  unsyncedText: {
    fontSize: 11,
    color: "#92400e",
    marginLeft: 4,
    fontWeight: "500",
  },
});
