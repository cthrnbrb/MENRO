import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/auth-context";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import axios from "@/src/api/axios";

const codeImage = require("../../assets/images/code.png");

interface Organization {
  id: string;
  org_name: string;
  organization_code: string;
}

interface UserOrganization {
  id: string;
  user_id: string;
  organization_id: string;
  org_role: 'president' | 'member';
  status: 'pending' | 'accepted' | 'rejected' | 'removed';
  organization?: Organization;
}

export default function OrganizationDashboard() {
  const router = useRouter();
  const { user, organizations, joinOrganization } = useAuth();
  const [orgCode, setOrgCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleJoinOrganization = async () => {
    if (!orgCode.trim()) {
      Alert.alert("Error", "Please enter an organization code");
      return;
    }

    try {
      setLoading(true);
      await joinOrganization({ code: orgCode.trim() });
      setOrgCode("");
    } catch (error) {
      console.error("Join organization error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationPress = (org: UserOrganization) => {
    if (org.status === 'accepted') {
      if (org.org_role === 'president') {
        router.push('/organization/president/home' as any);
      } else {
        router.push('/organization/member' as any);
      }
    } else if (org.status === 'pending') {
      Alert.alert("Pending", "Your membership request is still pending approval");
    } else if (org.status === 'rejected') {
      Alert.alert("Rejected", "Your membership request was rejected");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      case 'removed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Active';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      case 'removed': return 'Removed';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Organizations</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Join Section */}
        <View style={styles.joinSection}>
          <View style={styles.joinCard}>
            <View style={styles.joinHeader}>
              <MaterialIcons name="add-circle-outline" size={24} color="#10b981" />
              <Text style={styles.joinTitle}>Join Organization</Text>
            </View>
            <Text style={styles.joinSubtitle}>
              Enter the class code provided by your organization president
            </Text>
            <View style={styles.codeInputContainer}>
              <TextInput
                style={styles.codeInput}
                placeholder="Class code"
                value={orgCode}
                onChangeText={setOrgCode}
                placeholderTextColor="#9ca3af"
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[styles.joinButton, !orgCode.trim() && styles.joinButtonDisabled]}
                onPress={handleJoinOrganization}
                disabled={loading || !orgCode.trim()}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.joinButtonText}>Join</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Organizations Grid */}
        <View style={styles.orgsSection}>
          <Text style={styles.sectionTitle}>Your Organizations</Text>
          {organizations.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="class" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No organizations yet</Text>
              <Text style={styles.emptySubtitle}>
                Join an organization to see it here
              </Text>
            </View>
          ) : (
            <View style={styles.orgsGrid}>
              {organizations.map((org) => (
                <TouchableOpacity
                  key={org.id}
                  style={styles.orgCard}
                  onPress={() => handleOrganizationPress(org)}
                >
                  <View style={[styles.orgCardHeader, { backgroundColor: getStatusColor(org.status) }]}>
                    <FontAwesome name="building" size={32} color="white" />
                    <View style={styles.orgCardOverlay}>
                      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(org.status) }]} />
                    </View>
                  </View>
                  <View style={styles.orgCardBody}>
                    <Text style={styles.orgName} numberOfLines={2}>
                      {org.organization?.org_name || 'Unknown Organization'}
                    </Text>
                    <Text style={styles.orgCode}>
                      {org.organization?.organization_code || 'N/A'}
                    </Text>
                    <View style={styles.orgMeta}>
                      <Text style={styles.orgRole}>
                        {org.org_role === 'president' ? 'President' : 'Member'}
                      </Text>
                      <Text style={styles.orgStatus}>
                        {getStatusText(org.status)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <View style={styles.helpCard}>
            <MaterialIcons name="help-outline" size={20} color="#6b7280" />
            <Text style={styles.helpText}>
              Organization codes are shared by presidents. Ask your organization president for the code.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
  },
  scrollView: {
    flex: 1,
  },
  joinSection: {
    padding: 20,
  },
  joinCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  joinHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  joinTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 12,
  },
  joinSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
    lineHeight: 20,
  },
  codeInputContainer: {
    flexDirection: "row",
    gap: 12,
  },
  codeInput: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1f2937",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 1,
  },
  joinButton: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  joinButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  orgsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
    textAlign: "center",
  },
  orgsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  orgCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "48%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  orgCardHeader: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  orgCardOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  orgCardBody: {
    padding: 16,
  },
  orgName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
    minHeight: 40,
  },
  orgCode: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
    fontWeight: "500",
  },
  orgMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orgRole: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
  },
  orgStatus: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  helpSection: {
    padding: 20,
    paddingTop: 0,
  },
  helpCard: {
    flexDirection: "row",
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  helpText: {
    flex: 1,
    fontSize: 13,
    color: "#0369a1",
    marginLeft: 12,
    lineHeight: 18,
  },
});