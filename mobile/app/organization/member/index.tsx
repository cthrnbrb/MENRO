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
  Dimensions,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useCallback } from "react";
import MemberFooter from "../../../src/components/MemberFooter";
import axios from "@/src/api/axios";

const { width } = Dimensions.get('window');

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

export default function OrganizationMyTreesScreen() {
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
    router.push(`/organization/member/tree-details?id=${tree.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* MODERN HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                onPress={() => router.push("/organization/member/profile")}
                style={styles.profileOuterCircle}
              >
                {user?.photo ? (
                  <Image 
                    source={{ 
                      uri: user.photo.startsWith("http") 
                        ? user.photo 
                        : `http://192.168.1.16:8000/${user.photo}` 
                    }} 
                    style={styles.profileImage} 
                  />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <MaterialIcons name="person" size={30} color="#9ca3af" />
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.greetingContainer}>
                <Text style={styles.welcomeText}>{user?.first_name || "Member"}</Text>
                <Text style={styles.orgNameText}>{organization?.org_name || 'Organization'}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/organization/member/notification")}
              style={styles.headerNotificationIcon}
            >
              <MaterialIcons name="notifications" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* RE-DESIGNED BANNER */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>MENRO</Text>
              <Text style={styles.bannerSubtitle}>
                Track your planted trees and contribute to ecosystem growth.
              </Text>
            </View>
            <Image source={require("../../../assets/images/forest1.jpg")} style={styles.bannerImage} resizeMode="cover" />
          </View>
        </View>

        {/* STATISTICS GRID */}
        {statistics && (
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <StatCard label="Total Trees" value={statistics.total_trees} icon={require("../../../assets/images/total.png")} />
              <StatCard label="Survival Rate" value={`${statistics.survival_rate}%`} icon={require("../../../assets/images/rate.png")} />
            </View>
            <View style={styles.statsRow}>
              <StatCard label="Alive" value={statistics.alive_trees} icon={require("../../../assets/images/alive.png")} />
              <StatCard label="Dead" value={statistics.dead_trees} icon={require("../../../assets/images/dead.png")} />
            </View>
          </View>
        )}

        {/* PRIMARY ACTIONS */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.mainActionBtn} onPress={() => router.push("/organization/member/geo-tag-tree")}>
            <MaterialIcons name="add" size={24} color="white" />
            <Text style={styles.actionText}>Add New Tree</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.mainActionBtn, { backgroundColor: '#3b82f6' }]} 
            onPress={() => {}}
          >
            <MaterialIcons name="nature" size={24} color="white" />
            <Text style={styles.actionText}>View All Trees ({trees.length})</Text>
          </TouchableOpacity>
        </View>

        {/* QUICK LINKS SECTION */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <QuickLink icon="account-circle" color="#6366f1" label="My Profile" onPress={() => router.push("/organization/member/profile")} />
          <QuickLink icon="settings" color="#64748b" label="Settings" onPress={() => {}} />
        </View>

        {/* TREES LIST SECTION */}
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
            <View style={styles.treeListContent}>
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
            </View>
          )}
        </View>
      </ScrollView>
      <MemberFooter />
    </View>
  );
}

// Sub-components for cleaner code
const StatCard = ({ label, value, icon }: any) => (
  <View style={styles.statItem}>
    <View style={styles.statIconContainer}>
      <Image source={icon} style={styles.statIcon} />
    </View>
    <View style={styles.statInfo}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);

const QuickLink = ({ icon, color, label, onPress }: any) => (
  <TouchableOpacity style={styles.quickActionItem} onPress={onPress}>
    <MaterialIcons name={icon} size={22} color={color} />
    <Text style={styles.quickActionText}>{label}</Text>
    <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 },
  
  // Header
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  profileOuterCircle: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: '#10b981', justifyContent: 'center', alignItems: 'center' },
  profileImage: { width: 48, height: 48, borderRadius: 24 },
  profileImagePlaceholder: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#f1f5f9", justifyContent: "center", alignItems: "center" },
  greetingContainer: { marginLeft: 12 },
  welcomeText: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  orgNameText: { fontSize: 13, color: "#64748b", fontWeight: '500' },
  headerNotificationIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#6366f1", justifyContent: "center", alignItems: "center" },

  // Banner
  bannerContainer: { paddingHorizontal: 20, marginBottom: 10 },
  bannerContent: { 
    flexDirection: "row", backgroundColor: "#ffffff", borderRadius: 20, padding: 20,
    elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }
  },
  bannerTextContainer: { flex: 1, justifyContent: 'center' },
  bannerTitle: { fontSize: 22, fontWeight: "800", color: "#10b981", marginBottom: 4 },
  bannerSubtitle: { fontSize: 13, color: "#64748b", lineHeight: 18 },
  bannerImage: { width: 90, height: 90, borderRadius: 15, marginLeft: 10 },

  // Stats
  statsContainer: { paddingHorizontal: 16, marginTop: 10 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  statItem: { 
    flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 15, 
    borderRadius: 18, borderWidth: 1, borderColor: "#f1f5f9", elevation: 2,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }
  },
  statIconContainer: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#f0fdf4", justifyContent: "center", alignItems: "center", marginRight: 12 },
  statIcon: { width: 28, height: 28 },
  statInfo: { flex: 1 },
  statLabel: { fontSize: 11, color: "#94a3b8", fontWeight: '600', textTransform: 'uppercase' },
  statValue: { fontSize: 18, fontWeight: "700", color: "#1e293b" },

  // Actions
  actionSection: { paddingHorizontal: 20, marginTop: 10 },
  mainActionBtn: { 
    flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#10b981", 
    padding: 16, borderRadius: 15, marginBottom: 12, elevation: 4,
    shadowColor: "#10b981", shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }
  },
  actionText: { color: "white", fontSize: 16, fontWeight: "700", marginLeft: 10 },

  // Quick Actions
  quickActionsSection: { paddingHorizontal: 20, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b", marginBottom: 15 },
  quickActionItem: { 
    flexDirection: "row", alignItems: "center", backgroundColor: "white", padding: 16, 
    borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: '#f1f5f9'
  },
  quickActionText: { flex: 1, fontSize: 15, color: "#334155", marginLeft: 15, fontWeight: "600" },

  // Trees Section
  treesSection: { paddingHorizontal: 20, marginTop: 10 },
  treeListContent: { paddingBottom: 20 },
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
    fontWeight: "600",
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
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  treePhotoContainer: {
    width: 70,
    height: 70,
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
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  treeMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  treeMetaText: {
    fontSize: 12,
    color: "#64748b",
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
    fontWeight: "600",
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
    fontWeight: "600",
  },
});
