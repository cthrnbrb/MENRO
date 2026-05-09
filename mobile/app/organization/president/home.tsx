import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/src/context/auth-context';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import axios from '@/src/api/axios';
import PresidentFooter from '@/src/components/PresidentFooter';

const { width } = Dimensions.get('window');

export default function PresidentDashboard() {
  const router = useRouter();
  const { user, organizations } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingRequests: 0,
    activeTrees: 0,
    totalEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const userOrganization = organizations.find(org => org.status === 'accepted');

  const fetchStats = async () => {
    try {
      if (!userOrganization?.organization_id) return;
      // TODO: Create stats endpoint in backend
      // const response = await axios.get(`/organization/${userOrganization.organization_id}/stats`);
      // setStats(response.data);
      
      // Temporary fallback data
      setStats({
        totalMembers: 0,
        pendingRequests: 0,
        activeTrees: 0,
        totalEvents: 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchStats(); }, [userOrganization]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true); fetchStats();}} />}
      >
        {/* MODERN HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                onPress={() => router.push('/organization/president/profile' as any)}
                style={styles.profileOuterCircle}
              >
                {user?.photo ? (
                  <Image source={{ uri: user.photo.startsWith("http") ? user.photo : `http://192.168.1.16:8000/${user.photo}` }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileImagePlaceholder}><MaterialIcons name="person" size={30} color="#9ca3af" /></View>
                )}
              </TouchableOpacity>
              <View style={styles.greetingContainer}>
                <Text style={styles.welcomeText}>{user?.first_name || "President"}</Text>
                <Text style={styles.orgNameText}>{userOrganization?.organization?.org_name || 'Organization'}</Text>
              </View>
            </View>
            <View style={styles.logosContainer}>
              <Image source={require("../../../assets/images/OpolLogo.png")} style={styles.logoImage} resizeMode="contain" />
              <Image source={require("../../../assets/images/menrologo.jpg")} style={styles.logoImage} resizeMode="contain" />
            </View>
          </View>
        </View>

        {/* RE-DESIGNED BANNER */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>MENRO</Text>
              <Text style={styles.bannerSubtitle}>
                Manage your members and track ecosystem growth in real-time.
              </Text>
            </View>
            <Image source={require("../../../assets/images/forest1.jpg")} style={styles.bannerImage} resizeMode="cover" />
          </View>
        </View>

        {/* STATISTICS GRID - Matching the image style */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard label="Total Members" value={stats.totalMembers} icon={require("../../../assets/images/total.png")} />
            <StatCard label="Survival Rate" value={`${stats.totalEvents}%`} icon={require("../../../assets/images/rate.png")} />
          </View>
          <View style={styles.statsRow}>
            <StatCard label="Active Trees" value={stats.activeTrees} icon={require("../../../assets/images/alive.png")} />
            <StatCard label="Pending" value={stats.pendingRequests} icon={require("../../../assets/images/dead.png")} />
          </View>
        </View>

        {/* PRIMARY ACTIONS */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.mainActionBtn} onPress={() => router.push('/organization/president/members' as any)}>
            <MaterialIcons name="people" size={24} color="white" />
            <Text style={styles.actionText}>View All Members</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.mainActionBtn, { backgroundColor: '#3b82f6' }]} onPress={() => router.push('/organization/president/membership-requests' as any)}>
            <MaterialIcons name="how-to-reg" size={24} color="white" />
            <Text style={styles.actionText}>Membership Requests</Text>
            {stats.pendingRequests > 0 && <View style={styles.notifBadge}><Text style={styles.notifText}>{stats.pendingRequests}</Text></View>}
          </TouchableOpacity>
        </View>

        {/* QUICK LINKS SECTION */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <QuickLink icon="account-circle" color="#6366f1" label="President Profile" onPress={() => router.push('/organization/president/profile' as any)} />
          <QuickLink icon="settings" color="#64748b" label="Org Settings" onPress={() => {}} />
        </View>
      </ScrollView>
      <PresidentFooter />
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  
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
  logosContainer: { flexDirection: "row", gap: 8 },
  logoImage: { width: 40, height: 40, borderRadius: 20 },

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
  notifBadge: { backgroundColor: "#ef4444", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 10 },
  notifText: { color: "white", fontSize: 12, fontWeight: "800" },

  // Quick Actions
  quickActionsSection: { paddingHorizontal: 20, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b", marginBottom: 15 },
  quickActionItem: { 
    flexDirection: "row", alignItems: "center", backgroundColor: "white", padding: 16, 
    borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: '#f1f5f9'
  },
  quickActionText: { flex: 1, fontSize: 15, color: "#334155", marginLeft: 15, fontWeight: "600" },
});