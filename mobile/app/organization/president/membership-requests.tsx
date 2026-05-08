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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/auth-context';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import axios from '@/src/api/axios';

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
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Alert.alert('Error', 'Failed to fetch membership requests');
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
      await axios.post(`/organization/${userOrganization?.organization_id}/approve-membership`, {
        request_id: requestId,
      });
      
      setRequests(requests.filter(req => req.id !== requestId));
      Alert.alert('Success', 'Membership request approved successfully');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to approve request');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestId: string) => {
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this membership request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setProcessing(requestId);
            try {
              await axios.post(`/organization/${userOrganization?.organization_id}/reject-membership`, {
                request_id: requestId,
              });
              
              setRequests(requests.filter(req => req.id !== requestId));
              Alert.alert('Success', 'Membership request rejected');
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-600 pt-12 pb-6 px-6">
        <Text className="text-white text-2xl font-bold">Membership Requests</Text>
        <Text className="text-green-100 text-sm mt-1">
          Review and manage new member applications
        </Text>
      </View>

      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {requests.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <MaterialIcons name="inbox" size={64} color="#9ca3af" />
            <Text className="text-gray-500 text-lg mt-4">No pending requests</Text>
            <Text className="text-gray-400 text-sm mt-2">
              All membership requests have been processed
            </Text>
          </View>
        ) : (
          <View className="px-6 py-4 space-y-4">
            {requests.map((request) => (
              <View key={request.id} className="bg-white rounded-xl p-4 shadow-sm">
                <View className="flex-row">
                  {/* User Avatar */}
                  <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mr-4">
                    {request.user.photo ? (
                      <Image
                        source={{ uri: request.user.photo }}
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <FontAwesome name="user" size={24} color="#10b981" />
                    )}
                  </View>

                  {/* User Info */}
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">
                      {request.user.first_name} {request.user.middle_name} {request.user.last_name}
                    </Text>
                    <Text className="text-gray-600 text-sm">{request.user.email}</Text>
                    {request.user.contact_number && (
                      <Text className="text-gray-500 text-sm">{request.user.contact_number}</Text>
                    )}
                    <View className="flex-row items-center mt-2">
                      <MaterialIcons name="schedule" size={14} color="#9ca3af" />
                      <Text className="text-gray-500 text-xs ml-1">
                        Requested {new Date(request.requested_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row space-x-3 mt-4">
                  <TouchableOpacity
                    className={`flex-1 bg-green-500 py-2 px-4 rounded-lg flex-row items-center justify-center ${
                      processing === request.id ? 'opacity-50' : ''
                    }`}
                    onPress={() => handleApprove(request.id)}
                    disabled={processing === request.id}
                  >
                    {processing === request.id ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <MaterialIcons name="check-circle" size={18} color="white" />
                        <Text className="text-white font-semibold ml-2">Approve</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`flex-1 bg-red-500 py-2 px-4 rounded-lg flex-row items-center justify-center ${
                      processing === request.id ? 'opacity-50' : ''
                    }`}
                    onPress={() => handleReject(request.id)}
                    disabled={processing === request.id}
                  >
                    {processing === request.id ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <MaterialIcons name="cancel" size={18} color="white" />
                        <Text className="text-white font-semibold ml-2">Reject</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
