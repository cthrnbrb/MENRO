import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/auth-context';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import axios from '@/src/api/axios';

interface OrganizationDetails {
  id: string;
  org_name: string;
  organization_code: string;
  president_id?: string;
  president?: {
    id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
  };
  created_at: string;
  member_count: number;
}

export default function OrganizationProfile() {
  const router = useRouter();
  const { user, organizations } = useAuth();
  const [organization, setOrganization] = useState<OrganizationDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const userOrganization = organizations.find(org => org.status === 'accepted');
  const isPresident = userOrganization?.org_role === 'president';

  const fetchOrganizationDetails = async () => {
    try {
      if (!userOrganization?.organization_id) return;
      
      const response = await axios.get(`/organization/${userOrganization.organization_id}/details`);
      setOrganization(response.data);
    } catch (error) {
      console.error('Error fetching organization details:', error);
      Alert.alert('Error', 'Failed to fetch organization details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationDetails();
  }, [userOrganization]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!organization) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">Organization not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-600 pt-12 pb-8 px-6">
        <View className="items-center">
          <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-4">
            <FontAwesome name="building" size={40} color="#10b981" />
          </View>
          <Text className="text-white text-2xl font-bold text-center">
            {organization.org_name}
          </Text>
          <Text className="text-green-100 text-sm mt-2">
            Organization Code: {organization.organization_code}
          </Text>
        </View>
      </View>

      {/* Organization Info */}
      <View className="px-6 -mt-4">
        <View className="bg-white rounded-xl p-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Organization Information</Text>
          
          <View className="space-y-4">
            <View className="flex-row">
              <MaterialIcons name="business" size={20} color="#6b7280" className="mr-3 mt-1" />
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Organization Name</Text>
                <Text className="text-gray-800 font-medium">{organization.org_name}</Text>
              </View>
            </View>

            <View className="flex-row">
              <MaterialIcons name="code" size={20} color="#6b7280" className="mr-3 mt-1" />
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Organization Code</Text>
                <Text className="text-gray-800 font-medium">{organization.organization_code}</Text>
              </View>
            </View>

            <View className="flex-row">
              <MaterialIcons name="people" size={20} color="#6b7280" className="mr-3 mt-1" />
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Total Members</Text>
                <Text className="text-gray-800 font-medium">{organization.member_count} members</Text>
              </View>
            </View>

            <View className="flex-row">
              <MaterialIcons name="calendar-today" size={20} color="#6b7280" className="mr-3 mt-1" />
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Established</Text>
                <Text className="text-gray-800 font-medium">
                  {new Date(organization.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* President Info */}
      {organization.president && (
        <View className="px-6 mt-4">
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Organization President</Text>
            
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-yellow-100 rounded-full items-center justify-center mr-4">
                <FontAwesome name="user" size={24} color="#f59e0b" />
              </View>
              
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  {organization.president.first_name} {organization.president.middle_name} {organization.president.last_name}
                </Text>
                <Text className="text-gray-600 text-sm">{organization.president.email}</Text>
                <View className="flex-row items-center mt-2">
                  <View className="bg-yellow-100 px-2 py-1 rounded-full">
                    <Text className="text-yellow-800 text-xs font-semibold">President</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Your Role */}
      <View className="px-6 mt-4">
        <View className="bg-white rounded-xl p-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Your Role</Text>
          
          <View className="flex-row items-center">
            <View className={`w-16 h-16 rounded-full items-center justify-center mr-4 ${
              isPresident ? 'bg-yellow-100' : 'bg-blue-100'
            }`}>
              <FontAwesome 
                name={isPresident ? "star" : "user"} 
                size={24} 
                color={isPresident ? "#f59e0b" : "#3b82f6"} 
              />
            </View>
            
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800 capitalize">
                {isPresident ? 'President' : 'Member'}
              </Text>
              <Text className="text-gray-600 text-sm">
                {isPresident 
                  ? 'You can manage membership requests and organization settings'
                  : 'You can participate in organization activities and view member information'
                }
              </Text>
            </View>
          </View>

          {isPresident && (
            <TouchableOpacity 
              className="mt-4 bg-green-500 py-3 px-4 rounded-lg flex-row items-center justify-center"
              onPress={() => router.push('/organization/president/membership-requests' as any)}
            >
              <MaterialIcons name="how-to-reg" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Manage Membership Requests</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="h-20" />
    </ScrollView>
  );
}
