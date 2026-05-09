import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import MonitoringNavFooter from "@/src/components/MonitoringNavFooter";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "@/src/api/axios";
import { getToken } from "@/src/services/auth-storage";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  photo?: string;
}


export default function MonitoringHomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const API_BASE = axios.defaults.baseURL?.replace(/\/api$/, "") || "http://192.168.1.2:8000";

  const fetchUser = async () => {
    try {
      const token = await getToken();
      const response = await axios.get('/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };


return (
  <View style={styles.container}>
    {/* Top Header Bar */}
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => router.push("/monitoring/profile")}>
        <View style={styles.avatarContainer}>
          {user?.photo ? (
            <Image
              source={{
                uri: user.photo.startsWith("http") || user.photo.startsWith("file://")
                  ? user.photo
                  : `${API_BASE}/${user.photo}`,
              }}
              style={styles.avatarImage}
            />
          ) : (
            <MaterialIcons name="person" size={20} color="#fff" />
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.brandContainer}>
        <Text style={styles.brandTitle}>{user ? `${user.first_name} ${user.last_name}` : 'Guest'}</Text>
        <Text style={styles.brandSubtitle}>Tree Monitoring System</Text>
      </View>
      <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push("/monitoring/notifications")}>
        <MaterialIcons name="notifications-none" size={24} color="#1f2937" />
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>3</Text>
        </View>
      </TouchableOpacity>
    </View>

    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerContent}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>MENRO</Text>
            <Text style={styles.bannerSubtitle}>
              Trees are important in our Ecosystem, it provides protection
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

      {/* Statistics Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>Overview</Text>
          <TouchableOpacity>
            <Text style={styles.statsLink}>View Details</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.chartContainer}>
          <View style={styles.chartBars}>
            <View style={styles.barItem}>
              <View style={styles.barWrapper}>
                <View style={[styles.bar, { height: '60%', backgroundColor: '#10b981' }]} />
              </View>
              <Text style={styles.barLabel}>Assignments</Text>
              <Text style={styles.barValue}>12</Text>
            </View>
            
            <View style={styles.barItem}>
              <View style={styles.barWrapper}>
                <View style={[styles.bar, { height: '25%', backgroundColor: '#f59e0b' }]} />
              </View>
              <Text style={styles.barLabel}>Pending</Text>
              <Text style={styles.barValue}>5</Text>
            </View>
            
            <View style={styles.barItem}>
              <View style={styles.barWrapper}>
                <View style={[styles.bar, { height: '85%', backgroundColor: '#3b82f6' }]} />
              </View>
              <Text style={styles.barLabel}>Trees</Text>
              <Text style={styles.barValue}>128</Text>
            </View>
            
            <View style={styles.barItem}>
              <View style={styles.barWrapper}>
                <View style={[styles.bar, { height: '78%', backgroundColor: '#8b5cf6' }]} />
              </View>
              <Text style={styles.barLabel}>Survival</Text>
              <Text style={styles.barValue}>78%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* My Assignments Section */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>My Assignments</Text>
        <TouchableOpacity onPress={() => router.push("/monitoring/assignment")}>
          <Text style={styles.sectionLink}>View All <MaterialIcons name="chevron-right" size={14} color="#10b981" /></Text>
        </TouchableOpacity>
      </View>

      <View style={styles.assignmentCard}>
        <View style={[styles.assignIconCircle, { backgroundColor: '#dcfce7' }]}>
          <MaterialIcons name="location-on" size={18} color="#10b981" />
        </View>
        <View style={styles.assignContent}>
          <View style={styles.assignTop}>
            <Text style={styles.assignTitle}>Pag-asa Reforestation</Text>
            <View style={[styles.assignStatusBadge, { backgroundColor: '#dcfce7' }]}>
              <View style={[styles.assignStatusDot, { backgroundColor: '#10b981' }]} />
              <Text style={[styles.assignStatusText, { color: '#166534' }]}>In Progress</Text>
            </View>
          </View>
          <Text style={styles.assignLocation}>Brgy. Pag-asa</Text>
          <View style={styles.assignMetaRow}>
            <Text style={styles.assignMetaInline}>Trees: <Text style={styles.assignMetaValue}>25</Text>                              Due: <Text style={styles.assignMetaValue}>May 22</Text></Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={18} color="#9ca3af" />
      </View>

      <View style={styles.assignmentCard}>
        <View style={[styles.assignIconCircle, { backgroundColor: '#fef3c7' }]}>
          <MaterialIcons name="location-on" size={18} color="#f59e0b" />
        </View>
        <View style={styles.assignContent}>
          <View style={styles.assignTop}>
            <Text style={styles.assignTitle}>San Isidro Tree Planting</Text>
            <View style={[styles.assignStatusBadge, { backgroundColor: '#fef3c7' }]}>
              <View style={[styles.assignStatusDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={[styles.assignStatusText, { color: '#92400e' }]}>Pending</Text>
            </View>
          </View>
          <Text style={styles.assignLocation}>Brgy. San Isidro</Text>
          <View style={styles.assignMetaRow}>
            <Text style={styles.assignMetaInline}>Trees: <Text style={styles.assignMetaValue}>40</Text>                              Due: <Text style={styles.assignMetaValue}>May 23</Text></Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={18} color="#9ca3af" />
      </View>

      <View style={styles.assignmentCard}>
        <View style={[styles.assignIconCircle, { backgroundColor: '#dbeafe' }]}>
          <MaterialIcons name="location-on" size={18} color="#3b82f6" />
        </View>
        <View style={styles.assignContent}>
          <View style={styles.assignTop}>
            <Text style={styles.assignTitle}>Maligaya Greening Project</Text>
            <View style={[styles.assignStatusBadge, { backgroundColor: '#fef3c7' }]}>
              <View style={[styles.assignStatusDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={[styles.assignStatusText, { color: '#92400e' }]}>Pending</Text>
            </View>
          </View>
          <Text style={styles.assignLocation}>Brgy. Maligaya</Text>
          <View style={styles.assignMetaRow}>
            <Text style={styles.assignMetaInline}>Trees: <Text style={styles.assignMetaValue}>35</Text>                              Due: <Text style={styles.assignMetaValue}>May 24</Text></Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={18} color="#9ca3af" />
      </View>

      {/* Tree Planting Map Section */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Tree Planting Map</Text>
        <TouchableOpacity onPress={() => router.push("/monitoring/map")}>
          <Text style={styles.sectionLink}>Open Map <MaterialIcons name="chevron-right" size={14} color="#10b981" /></Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapPreviewContainer}>
        <View style={styles.mapPreview}>
          <View style={styles.mapBackground}>
            {/* Base terrain layer */}
            <View style={[styles.mapTerrain, { backgroundColor: '#e8f5e8' }]} />
            
            {/* Forest/vegetation areas */}
            <View style={[styles.mapZone, { top: '5%', left: '10%', width: '35%', height: '30%', backgroundColor: '#86efac', borderRadius: 15 }]} />
            <View style={[styles.mapZone, { top: '25%', left: '40%', width: '40%', height: '25%', backgroundColor: '#22c55e', borderRadius: 20 }]} />
            <View style={[styles.mapZone, { top: '60%', left: '15%', width: '30%', height: '20%', backgroundColor: '#16a34a', borderRadius: 12 }]} />
            <View style={[styles.mapZone, { top: '45%', left: '65%', width: '25%', height: '30%', backgroundColor: '#15803d', borderRadius: 18 }]} />
            
            {/* Urban/residential areas */}
            <View style={[styles.mapZone, { top: '35%', left: '5%', width: '20%', height: '25%', backgroundColor: '#f3f4f6', borderRadius: 8 }]} />
            <View style={[styles.mapZone, { top: '70%', left: '50%', width: '35%', height: '15%', backgroundColor: '#e5e7eb', borderRadius: 10 }]} />
            
            {/* Water bodies */}
            <View style={[styles.mapWater, { top: '15%', right: '15%', width: '25%', height: '20%', borderRadius: 25 }]} />
            <View style={[styles.mapWater, { top: '55%', left: '60%', width: '15%', height: '12%', borderRadius: 15 }]} />
            
            {/* Roads */}
            <View style={[styles.mapRoad, { top: '20%', left: '8%', width: '70%', height: 3, transform: [{ rotate: '8deg' }] }]} />
            <View style={[styles.mapRoad, { top: '45%', left: '20%', width: '50%', height: 3, transform: [{ rotate: '-15deg' }] }]} />
            <View style={[styles.mapRoad, { top: '65%', left: '35%', width: '40%', height: 3, transform: [{ rotate: '5deg' }] }]} />
            <View style={[styles.mapRoad, { top: '30%', left: '55%', width: 3, height: '35%', transform: [{ rotate: '-10deg' }] }]} />
            
            {/* Map Pins */}
            <View style={[styles.mapPinWrap, { top: '18%', left: '25%' }]}>
              <View style={[styles.mapPinOuter, styles.mapPinGood]} />
              <View style={styles.mapPinInner} />
            </View>
            <View style={[styles.mapPinWrap, { top: '42%', left: '55%' }]}>
              <View style={[styles.mapPinOuter, styles.mapPinFair]} />
              <View style={styles.mapPinInner} />
            </View>
            <View style={[styles.mapPinWrap, { top: '65%', left: '30%' }]}>
              <View style={[styles.mapPinOuter, styles.mapPinGood]} />
              <View style={styles.mapPinInner} />
            </View>
            <View style={[styles.mapPinWrap, { top: '28%', left: '75%' }]}>
              <View style={[styles.mapPinOuter, styles.mapPinGood]} />
              <View style={styles.mapPinInner} />
            </View>
            <View style={[styles.mapPinWrap, { top: '72%', left: '65%' }]}>
              <View style={[styles.mapPinOuter, styles.mapPinGood]} />
              <View style={styles.mapPinInner} />
            </View>
            <View style={[styles.mapPinWrap, { top: '50%', left: '15%' }]}>
              <View style={[styles.mapPinOuter, styles.mapPinBlue]} />
              <View style={styles.mapPinInner} />
            </View>
          </View>
        </View>
        <View style={styles.mapStatsOverlay}>
          <View style={styles.mapStatItem}>
            <View style={[styles.mapStatDot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.mapStatLabel}>Good</Text>
            <Text style={styles.mapStatValue}>1,256</Text>
          </View>
          <View style={styles.mapStatItem}>
            <View style={[styles.mapStatDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.mapStatLabel}>Fair</Text>
            <Text style={styles.mapStatValue}>358</Text>
          </View>
          <View style={styles.mapStatItem}>
            <View style={[styles.mapStatDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.mapStatLabel}>Poor</Text>
            <Text style={styles.mapStatValue}>112</Text>
          </View>
          <View style={styles.mapStatDivider} />
          <View style={styles.mapStatItem}>
            <Text style={styles.mapStatLabel}>Total Trees</Text>
            <Text style={styles.mapStatValue}>1,726</Text>
          </View>
        </View>
      </View>

      {/* Quick Access */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <TouchableOpacity>
          <Text style={styles.sectionLink}>See All <MaterialIcons name="chevron-right" size={14} color="#10b981" /></Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.quickAccessContainer}>
        <TouchableOpacity style={styles.quickAccessCard} onPress={() => router.push("/monitoring/add")}>
          <View style={styles.quickAccessIcon}>
            <MaterialIcons name="add" size={20} color="#6b7280" />
          </View>
          <Text style={styles.quickAccessTitle}>Add Tree</Text>
          <MaterialIcons name="chevron-right" size={16} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickAccessCard}>
          <View style={styles.quickAccessIcon}>
            <MaterialIcons name="photo-camera" size={20} color="#6b7280" />
          </View>
          <Text style={styles.quickAccessTitle}>Upload Photos</Text>
          <MaterialIcons name="chevron-right" size={16} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickAccessCard}>
          <View style={styles.quickAccessIcon}>
            <MaterialIcons name="menu-book" size={20} color="#6b7280" />
          </View>
          <Text style={styles.quickAccessTitle}>Guidelines</Text>
          <MaterialIcons name="chevron-right" size={16} color="#9ca3af" />
        </TouchableOpacity>
      </View>

          </ScrollView>

    <MonitoringNavFooter />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  brandContainer: {
    flex: 1,
    marginLeft: 12,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 1,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  bannerContainer: {
    marginTop: 4,
    marginBottom: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  bannerImageContainer: {
    width: 120,
    height: 120,
    marginLeft: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  statsLink: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  chartContainer: {
    height: 120,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
    paddingHorizontal: 8,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    minHeight: 8,
  },
  barLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  sectionLink: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '500',
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  assignIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assignContent: {
    flex: 1,
  },
  assignTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  assignTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  assignStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  assignStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  assignStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  assignLocation: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 10,
  },
  assignMetaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  assignMetaItem: {
    flex: 1,
  },
  assignMetaLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },
  assignMetaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  assignMetaInline: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 16,
  },
  mapPreviewContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  mapPreview: {
    height: 160,
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    position: 'relative',
  },
  mapTerrain: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e8f5e8',
  },
  mapZone: {
    position: 'absolute',
    opacity: 0.8,
  },
  mapRoad: {
    position: 'absolute',
    backgroundColor: '#d4d4d8',
    opacity: 0.9,
    borderRadius: 2,
  },
  mapWater: {
    position: 'absolute',
    backgroundColor: '#93c5fd',
    opacity: 0.6,
  },
  mapPinWrap: {
    position: 'absolute',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPinOuter: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  mapPinInner: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  mapPinGood: {
    backgroundColor: '#10b981',
  },
  mapPinFair: {
    backgroundColor: '#f59e0b',
  },
  mapPinBlue: {
    backgroundColor: '#3b82f6',
  },
  mapStatsOverlay: {
    position: 'absolute',
    right: 12,
    top: 12,
    bottom: 12,
    width: 130,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mapStatDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  mapStatLabel: {
    fontSize: 11,
    color: '#6b7280',
    flex: 1,
  },
  mapStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  mapStatDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  quickAccessContainer: {
    gap: 8,
    marginBottom: 16,
  },
  quickAccessCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickAccessIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickAccessTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    marginLeft: 16,
  },
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  bannerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bannerTextContent: {
    flex: 1,
  },
  bannerMainText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  bannerSubText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
});
