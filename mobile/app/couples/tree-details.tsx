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
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { getToken } from "@/src/services/auth-storage";
import axios from "@/src/api/axios";

interface Tree {
  id: number;
  tree_species: string;
  latitude: number;
  longitude: number;
  photo: string;
  planted_at: string;
  synced_at: string;
  activity_id: number;
  planter_id: number;
  status: 'alive' | 'dead';
}

export default function CoupleTreeDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams() as { id: string };
  const [tree, setTree] = useState<Tree | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreeDetails();
  }, [id]);

  const fetchTreeDetails = async () => {
    try {
      const response = await axios.get(`/trees/${id}`);
      setTree(response.data.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch tree details");
      console.error(error);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const openMap = () => {
    if (tree) {
      const url = `https://www.google.com/maps?q=${tree.latitude},${tree.longitude}`;
      // In a real app, you would use Linking.openURL(url)
      Alert.alert("Open Map", `Would open: ${url}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!tree) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color="#ef4444" />
        <Text style={styles.errorText}>Tree not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#166534" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tree Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tree Photo */}
        <View style={styles.photoSection}>
          {tree.photo ? (
            <Image source={{ uri: tree.photo }} style={styles.treePhoto} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <MaterialIcons name="nature" size={64} color="#9ca3af" />
              <Text style={styles.photoPlaceholderText}>No Photo Available</Text>
            </View>
          )}
        </View>

        {/* Tree Information */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialIcons name="nature" size={24} color="#10b981" />
              <Text style={styles.infoTitle}>{tree.tree_species}</Text>
              <View style={[styles.statusBadge, tree.status === 'alive' ? styles.aliveBadge : styles.deadBadge]}>
                <Text style={[styles.statusText, tree.status === 'alive' ? styles.aliveText : styles.deadText]}>
                  {tree.status}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={18} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>GPS Coordinates</Text>
                <Text style={styles.infoValue}>
                  {tree.latitude.toFixed(7)}, {tree.longitude.toFixed(7)}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={openMap} style={styles.mapButton}>
              <FontAwesome name="map-marker" size={16} color="#10b981" />
              <Text style={styles.mapButtonText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="event" size={18} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Planted Date</Text>
                <Text style={styles.infoValue}>{formatDate(tree.planted_at)}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="sync" size={18} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Last Synced</Text>
                <Text style={styles.infoValue}>
                  {tree.synced_at ? formatDate(tree.synced_at) : "Not synced"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="tag" size={18} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Tree ID</Text>
                <Text style={styles.infoValue}>#{tree.id}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="assignment" size={18} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Activity ID</Text>
                <Text style={styles.infoValue}>#{tree.activity_id}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sync Status */}
        <View style={styles.syncSection}>
          {tree.synced_at ? (
            <View style={styles.syncedCard}>
              <FontAwesome name="check-circle" size={32} color="#10b981" />
              <Text style={styles.syncedTitle}>Synced Successfully</Text>
              <Text style={styles.syncedSubtitle}>
                Last synced: {formatDate(tree.synced_at)}
              </Text>
            </View>
          ) : (
            <View style={styles.unsyncedCard}>
              <FontAwesome name="hourglass" size={32} color="#f59e0b" />
              <Text style={styles.unsyncedTitle}>Pending Sync</Text>
              <Text style={styles.unsyncedSubtitle}>
                This tree will sync when internet is available
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

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
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f0fdf4",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#166534",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  photoSection: {
    height: 300,
    backgroundColor: "#f3f4f6",
  },
  treePhoto: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholderText: {
    marginTop: 12,
    color: "#9ca3af",
    fontSize: 16,
  },
  infoSection: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginLeft: 12,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aliveBadge: {
    backgroundColor: "#d1fae5",
  },
  deadBadge: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  aliveText: {
    color: "#065f46",
  },
  deadText: {
    color: "#991b1b",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
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
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  mapButtonText: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  syncSection: {
    padding: 20,
  },
  syncedCard: {
    backgroundColor: "#d1fae5",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  syncedTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#065f46",
    marginTop: 12,
  },
  syncedSubtitle: {
    fontSize: 14,
    color: "#047857",
    marginTop: 4,
    textAlign: "center",
  },
  unsyncedCard: {
    backgroundColor: "#fef3c7",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  unsyncedTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#92400e",
    marginTop: 12,
  },
  unsyncedSubtitle: {
    fontSize: 14,
    color: "#b45309",
    marginTop: 4,
    textAlign: "center",
  },
});
