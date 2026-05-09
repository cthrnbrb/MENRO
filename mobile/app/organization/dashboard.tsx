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
        <Text style={styles.headerSubtitle}>Manage your organization memberships</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Join Organization Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Join Organization</Text>
          <View style={styles.joinCard}>
            <Image 
              source={codeImage} 
              style={styles.codeImage}
              resizeMode="contain"
            />
            <Text style={styles.joinCardText}>
              Enter an organization code to join and collaborate with other members
            </Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="code" size={20} color="#6b7280" />
              <TextInput
                style={styles.input}
                placeholder="Enter organization code"
                value={orgCode}
                onChangeText={setOrgCode}
                placeholderTextColor="#9ca3af"
              />
            </View>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoinOrganization}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.joinButtonText}>Join Organization</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Organization List Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Organizations</Text>
          {organizations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="business-center" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>No organizations yet</Text>
              <Text style={styles.emptySubtext}>
                Join an organization to get started
              </Text>
            </View>
          ) : (
            organizations.map((org) => (
              <TouchableOpacity
                key={org.id}
                style={styles.orgCard}
                onPress={() => handleOrganizationPress(org)}
              >
                <View style={[styles.orgCardHeader, { backgroundColor: getStatusColor(org.status) }]}>
                  <FontAwesome name="building" size={32} color="white" />
                </View>
                <View style={styles.orgCardBody}>
                  <Text style={styles.orgName}>
                    {org.organization?.org_name || 'Unknown Organization'}
                  </Text>
                  <Text style={styles.orgCode}>
                    Code: {org.organization?.organization_code || 'N/A'}
                  </Text>
                  <View style={styles.orgMeta}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(org.status) }
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusText(org.status)}
                      </Text>
                    </View>
                    {org.status === 'accepted' && (
                      <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>
                          {org.org_role === 'president' ? 'President' : 'Member'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <MaterialIcons name="info" size={20} color="#6b7280" />
            <Text style={styles.infoText}>
              Organization codes are provided by organization presidents. Contact your organization's president to get the code.
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
    backgroundColor: "#10b981",
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 6,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 20,
  },
  joinCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  codeImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
    opacity: 0.8,
  },
  joinCardText: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    marginVertical: 20,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    width: "100%",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  input: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    color: "#1e293b",
  },
  joinButton: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 48,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  emptyText: {
    fontSize: 20,
    color: "#64748b",
    marginTop: 20,
    fontWeight: "700",
  },
  emptySubtext: {
    fontSize: 15,
    color: "#94a3b8",
    marginTop: 8,
    textAlign: "center",
  },
  orgCard: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  orgCardHeader: {
    height: 120,
    justifyContent: "flex-end",
    padding: 20,
  },
  orgCardBody: {
    padding: 20,
  },
  orgName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  orgCode: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  orgMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    color: "white",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  roleBadge: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    color: "white",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#fef3c7",
    borderRadius: 16,
    padding: 20,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#92400e",
    marginLeft: 14,
    lineHeight: 20,
  },
});