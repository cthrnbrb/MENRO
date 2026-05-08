import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/auth-context';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import axios from '@/src/api/axios';

interface OrganizationStats {
  totalMembers: number;
  pendingRequests: number;
  activeTrees: number;
  totalEvents: number;
}

export default function OrganizationDashboard() {
  const router = useRouter();
  const { user, organizations } = useAuth();
  const [stats, setStats] = useState<OrganizationStats>({
    totalMembers: 0,
    pendingRequests: 0,
    activeTrees: 0,
    totalEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const userOrganization = organizations.find(org => org.status === 'accepted');
  const isPresident = userOrganization?.org_role === 'president';
  const hasOrganization = organizations.length > 0;

  const fetchStats = async () => {
    try {
      if (!userOrganization?.organization_id) return;
      
      const response = await axios.get(`/organization/${userOrganization.organization_id}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [userOrganization]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  // Show join organization screen if user has no organizations
  if (!hasOrganization) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="bg-green-600 pt-12 pb-8 px-6">
          <Text className="text-white text-2xl font-bold mb-2">
            Welcome, {user?.first_name}!
          </Text>
          <Text className="text-green-100 text-lg">
            Join an organization to get started
          </Text>
        </View>

        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-white rounded-xl p-8 shadow-sm items-center">
            <MaterialIcons name="business-center" size={64} color="#10b981" />
            <Text className="text-xl font-semibold text-gray-800 mt-4 mb-2 text-center">
              No Organization Yet
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              You need to join an organization to access its features and collaborate with other members.
            </Text>
            
            <TouchableOpacity
              className="bg-green-500 py-3 px-6 rounded-full flex-row items-center"
              onPress={() => router.push('/organization/member/join-organization' as any)}
            >
              <MaterialIcons name="add-circle" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Join Organization</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="bg-green-600 pt-12 pb-8 px-6">
        <Text className="text-white text-2xl font-bold mb-2">
          Welcome, {user?.first_name}!
        </Text>
        <Text className="text-green-100 text-lg">
          {userOrganization?.organization?.org_name}
        </Text>
        <View className="flex-row items-center mt-2">
          <View className={`px-3 py-1 rounded-full ${
            isPresident ? 'bg-yellow-400' : 'bg-blue-400'
          }`}>
            <Text className="text-white text-sm font-semibold capitalize">
              {isPresident ? 'President' : 'Member'}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="px-6 -mt-4">
        <View className="grid grid-cols-2 gap-4">
          <TouchableOpacity 
            className="bg-white rounded-xl p-4 shadow-sm"
            onPress={() => router.push('/organization/president/members' as any)}
          >
            <View className="flex-row items-center justify-between mb-2">
              <FontAwesome name="users" size={24} color="#10b981" />
              <Text className="text-2xl font-bold text-gray-800">{stats.totalMembers}</Text>
            </View>
            <Text className="text-gray-600 text-sm">Total Members</Text>
          </TouchableOpacity>

          {isPresident && (
            <TouchableOpacity 
              className="bg-white rounded-xl p-4 shadow-sm"
              onPress={() => router.push('/organization/president/membership-requests' as any)}
            >
              <View className="flex-row items-center justify-between mb-2">
                <MaterialIcons name="person-add" size={24} color="#f59e0b" />
                <Text className="text-2xl font-bold text-gray-800">{stats.pendingRequests}</Text>
              </View>
              <Text className="text-gray-600 text-sm">Pending Requests</Text>
            </TouchableOpacity>
          )}

          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <MaterialIcons name="nature" size={24} color="#10b981" />
              <Text className="text-2xl font-bold text-gray-800">{stats.activeTrees}</Text>
            </View>
            <Text className="text-gray-600 text-sm">Active Trees</Text>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <MaterialIcons name="event" size={24} color="#8b5cf6" />
              <Text className="text-2xl font-bold text-gray-800">{stats.totalEvents}</Text>
            </View>
            <Text className="text-gray-600 text-sm">Total Events</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 mt-6">
        <Text className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</Text>
        <View className="space-y-3">
          <TouchableOpacity 
            className="bg-white rounded-xl p-4 shadow-sm flex-row items-center"
            onPress={() => router.push('/organization/president/members' as any)}
          >
            <FontAwesome name="users" size={20} color="#10b981" className="mr-3" />
            <Text className="text-gray-800 font-medium">View Members</Text>
            <MaterialIcons name="chevron-right" size={20} color="#9ca3af" className="ml-auto" />
          </TouchableOpacity>

          {isPresident && (
            <TouchableOpacity 
              className="bg-white rounded-xl p-4 shadow-sm flex-row items-center"
              onPress={() => router.push('/organization/president/membership-requests' as any)}
            >
              <MaterialIcons name="how-to-reg" size={20} color="#f59e0b" className="mr-3" />
              <Text className="text-gray-800 font-medium">Manage Requests</Text>
              {stats.pendingRequests > 0 && (
                <View className="bg-red-500 px-2 py-1 rounded-full ml-2">
                  <Text className="text-white text-xs font-bold">{stats.pendingRequests}</Text>
                </View>
              )}
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" className="ml-auto" />
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            className="bg-white rounded-xl p-4 shadow-sm flex-row items-center"
            onPress={() => router.push('/organization/member/profile' as any)}
          >
            <MaterialIcons name="account-circle" size={20} color="#6366f1" className="mr-3" />
            <Text className="text-gray-800 font-medium">Organization Profile</Text>
            <MaterialIcons name="chevron-right" size={20} color="#9ca3af" className="ml-auto" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="h-20" />
    </ScrollView>
  );
}
