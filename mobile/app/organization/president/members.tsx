import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/auth-context';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import axios from '@/src/api/axios';

interface Member {
  id: string;
  user_id: string;
  organization_id: string;
  org_role: 'president' | 'member';
  status: 'accepted';
  joined_at: string;
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

export default function OrganizationMembers() {
  const router = useRouter();
  const { user, organizations } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userOrganization = organizations.find(org => org.status === 'accepted');
  const isPresident = userOrganization?.org_role === 'president';

  const fetchMembers = async () => {
    try {
      if (!userOrganization?.organization_id) return;
      
      const response = await axios.get(`/organization/${userOrganization.organization_id}/members`);
      setMembers(response.data);
      setFilteredMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [userOrganization]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(member =>
        `${member.user.first_name} ${member.user.middle_name} ${member.user.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        member.user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMembers();
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!isPresident) return;
    
    // Don't allow removing yourself
    if (memberId === user?.id) {
      Alert.alert('Error', 'You cannot remove yourself from the organization');
      return;
    }

    Alert.alert(
      'Remove Member',
      'Are you sure you want to remove this member from the organization?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.post(`/organization/${userOrganization?.organization_id}/remove-member`, {
                user_id: memberId,
              });
              
              setMembers(members.filter(member => member.user.id !== memberId));
              Alert.alert('Success', 'Member removed successfully');
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to remove member');
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
        <Text className="text-white text-2xl font-bold">Organization Members</Text>
        <Text className="text-green-100 text-sm mt-1">
          {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
          <MaterialIcons name="search" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-3 text-gray-800"
            placeholder="Search members..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="clear" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredMembers.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <FontAwesome name="users" size={64} color="#9ca3af" />
            <Text className="text-gray-500 text-lg mt-4">
              {searchQuery.length > 0 ? 'No members found' : 'No members yet'}
            </Text>
            <Text className="text-gray-400 text-sm mt-2">
              {searchQuery.length > 0 
                ? 'Try adjusting your search terms' 
                : 'Members will appear here once they join'
              }
            </Text>
          </View>
        ) : (
          <View className="px-6 py-4 space-y-3">
            {filteredMembers.map((member) => (
              <View key={member.id} className="bg-white rounded-xl p-4 shadow-sm">
                <View className="flex-row items-center">
                  {/* User Avatar */}
                  <View className="w-14 h-14 bg-green-100 rounded-full items-center justify-center mr-4">
                    {member.user.photo ? (
                      <Image
                        source={{ uri: member.user.photo }}
                        className="w-14 h-14 rounded-full"
                      />
                    ) : (
                      <FontAwesome name="user" size={20} color="#10b981" />
                    )}
                  </View>

                  {/* User Info */}
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-lg font-semibold text-gray-800 flex-1">
                        {member.user.first_name} {member.user.middle_name} {member.user.last_name}
                      </Text>
                      <View className={`px-2 py-1 rounded-full ${
                        member.org_role === 'president' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <Text className={`text-xs font-semibold capitalize ${
                          member.org_role === 'president' ? 'text-yellow-800' : 'text-blue-800'
                        }`}>
                          {member.org_role}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-600 text-sm">{member.user.email}</Text>
                    {member.user.contact_number && (
                      <Text className="text-gray-500 text-sm">{member.user.contact_number}</Text>
                    )}
                    <View className="flex-row items-center mt-2">
                      <MaterialIcons name="event" size={14} color="#9ca3af" />
                      <Text className="text-gray-500 text-xs ml-1">
                        Joined {new Date(member.joined_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  {/* Actions */}
                  {isPresident && member.user.id !== user?.id && (
                    <TouchableOpacity
                      className="ml-3 p-2"
                      onPress={() => handleRemoveMember(member.user.id)}
                    >
                      <MaterialIcons name="more-vert" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
