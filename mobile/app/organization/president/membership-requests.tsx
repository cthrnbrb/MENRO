import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/auth-context';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import axios from '@/src/api/axios';
import PresidentFooter from '@/src/components/PresidentFooter';

const { width } = Dimensions.get('window');

interface MembershipRequest {
  id: string;
  user_id: string;
  organization_id: string;
  org_role: 'member';
  status: 'pending';
  requested_at: string;
  user: {
    id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    contact_number?: string;
    photo?: string;
  };
}

export default function MembershipRequests() {
  const router = useRouter();
  const { user, organizations } = useAuth();
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  const userOrganization = organizations.find(org => org.status === 'accepted');
  const isPresident = userOrganization?.org_role === 'president';

  useEffect(() => {
    if (!isPresident) {
      Alert.alert('Access Denied', 'Only presidents can manage membership requests.');
      router.back();
      return;
    }
  }, [isPresident]);

  const fetchRequests = async () => {
    try {
      if (!userOrganization?.organization_id) return;
      
      const response = await axios.get(`/organization/${userOrganization.organization_id}/membership-requests`);
      
      const pendingRequests = (response.data.data || []).map((item: any) => ({
        id: item.id?.toString(),
        user_id: item.user_id?.toString(),
        organization_id: item.organization_id?.toString(),
        org_role: item.org_role,
        status: item.status,
        requested_at: item.requested_at,
        user: item.user ? {
          id: item.user.id?.toString(),
          first_name: item.user.first_name || '',
          middle_name: item.user.middle_name || '',
          last_name: item.user.last_name || '',
          email: item.user.email || '',
          contact_number: item.user.contact_number || '',
          photo: item.user.photo || null,
        } : null,
      }));
      
      setRequests(pendingRequests);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch membership requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isPresident) {
      fetchRequests();
    }
  }, [isPresident, userOrganization]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const handleApprove = async (requestId: string) => {
    setProcessing(requestId);
    try {
      await axios.post(`/organization/${userOrganization?.organization_id}/members/${requestId}/respond`, {
        action: 'accept',
      });
      
      setRequests(requests.filter(req => req.id !== requestId));
      Alert.alert('Success', 'Member approved');
    } catch (error: any) {
      console.error('Approve error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to approve request');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestId: string) => {
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setProcessing(requestId);
            try {
              await axios.post(`/organization/${userOrganization?.organization_id}/members/${requestId}/respond`, {
                action: 'reject',
              });
              
              setRequests(requests.filter(req => req.id !== requestId));
              Alert.alert('Success', 'Member rejected');
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to reject request');
            } finally {
              setProcessing(null);
            }
          },
        },
      ]
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Compact Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Pending Requests</Text>
            <Text style={styles.headerSubtitle}>
              {requests.length} {requests.length === 1 ? 'request' : 'requests'} waiting
            </Text>
          </View>
          {requests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{requests.length}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <MaterialIcons name="check-circle" size={48} color="#10b981" />
            </View>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>
              No pending membership requests
            </Text>
          </View>
        ) : (
          <View style={styles.requestsList}>
            {requests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.cardContent}>
                  {/* Avatar */}
                  <View style={styles.avatarContainer}>
                    {request.user?.photo ? (
                      <Image
                        source={{ uri: request.user.photo }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                          {request.user ? getInitials(request.user.first_name, request.user.last_name) : '?'}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* User Info - Compact */}
                  <View style={styles.infoContainer}>
                    <Text style={styles.userName} numberOfLines={1}>
                      {request.user ? `${request.user.first_name} ${request.user.last_name}` : 'Unknown User'}
                    </Text>
                    <Text style={styles.userEmail} numberOfLines={1}>
                      {request.user?.email || 'No email'}
                    </Text>
                    <View style={styles.dateRow}>
                      <MaterialIcons name="schedule" size={12} color="#9ca3af" />
                      <Text style={styles.dateText}>
                        {new Date(request.requested_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  {/* Action Buttons - Icon only for clean look */}
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn, 
                        processing === request.id && styles.actionBtnDisabled
                      ]}
                      onPress={() => handleApprove(request.id)}
                      disabled={processing === request.id}
                    >
                      {processing === request.id ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <MaterialIcons name="check" size={20} color="white" />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn,
                        processing === request.id && styles.actionBtnDisabled
                      ]}
                      onPress={() => handleReject(request.id)}
                      disabled={processing === request.id}
                    >
                      <MaterialIcons name="close" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <PresidentFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#ef4444',
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  requestsList: {
    padding: 16,
    gap: 12,
  },
  requestCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  approveBtn: {
    backgroundColor: '#10b981',
  },
  rejectBtn: {
    backgroundColor: '#ef4444',
  },
});
