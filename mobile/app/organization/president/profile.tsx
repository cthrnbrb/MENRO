import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TextInput,
  Image,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { setToken } from '@/src/services/auth-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from '@/src/api/axios';
import PresidentFooter from '@/src/components/PresidentFooter';

interface User {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  address: string;
  role: string;
  created_at: string;
  photo?: string;
}

interface Organization {
  id: number;
  org_name: string;
  president_id?: number;
  organization_code: string;
  president?: {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
  };
}

interface Statistics {
  totalMembers: number;
  pendingRequests: number;
  activeTrees: number;
  survivalRate: number;
  lastActivity: string;
}

export default function PresidentProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    contact_number: '',
    address: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/user/profile');
      
      if (response.data && response.data.data) {
        setUser(response.data.data.user);
        setOrganization(response.data.data.organization);
        setStatistics(response.data.data.statistics);
        setPhoto(response.data.data.user.photo || null);
        
        const userData = response.data.data.user;
        setEditForm({
          first_name: userData.first_name || '',
          middle_name: userData.middle_name || '',
          last_name: userData.last_name || '',
          contact_number: userData.contact_number || '',
          address: userData.address || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhoto(uri);
      await uploadPhoto(uri);
    }
  };

  const uploadPhoto = async (uri: string) => {
    try {
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('photo', {
        uri,
        name: filename,
        type,
      } as any);

      const response = await axios.post('/user/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(response.data.data);
      setPhoto(response.data.data.photo || null);
      Alert.alert('Success', 'Photo updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update photo');
      console.error(error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      setEditForm({
        first_name: user.first_name,
        middle_name: user.middle_name || '',
        last_name: user.last_name,
        contact_number: user.contact_number,
        address: user.address,
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('/user/profile', editForm);
      setUser(response.data.data);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error(error);
    }
  };


  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.post('/logout');
              await setToken(null);
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header with Background */}
        <ImageBackground
          source={require('../../../assets/images/forest1.jpg')}
          style={styles.headerBackground}
        >
          <View style={styles.headerOverlay}>
            <View style={styles.profileImageContainer}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.profileImage} />
              ) : user?.photo ? (
                <Image
                  source={{
                    uri: user.photo.startsWith('http')
                      ? user.photo
                      : `http://192.168.1.16:8000/${user.photo}`,
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <MaterialIcons name="person" size={48} color="#9ca3af" />
                </View>
              )}
              <TouchableOpacity onPress={pickImage} style={styles.cameraButton}>
                <MaterialIcons name="camera-alt" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>
              {user?.first_name} {user?.middle_name} {user?.last_name}
            </Text>
            <Text style={styles.userRole}>President</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </ImageBackground>

        {/* Statistics Cards */}
        {statistics && (
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <FontAwesome name="users" size={24} color="#10b981" />
                <Text style={styles.statValue}>{statistics.totalMembers}</Text>
                <Text style={styles.statLabel}>Members</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="person-add" size={24} color="#f59e0b" />
                <Text style={styles.statValue}>{statistics.pendingRequests}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialIcons name="nature" size={24} color="#10b981" />
                <Text style={styles.statValue}>{statistics.activeTrees}</Text>
                <Text style={styles.statLabel}>Trees</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="trending-up" size={24} color="#8b5cf6" />
                <Text style={styles.statValue}>{statistics.survivalRate}%</Text>
                <Text style={styles.statLabel}>Survival</Text>
              </View>
            </View>
          </View>
        )}

        {/* Organization Info */}
        {organization && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Organization</Text>
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <MaterialIcons name="business" size={20} color="#10b981" />
                <Text style={styles.cardLabel}>Organization Name</Text>
              </View>
              <Text style={styles.cardValue}>{organization.org_name}</Text>
              
              <View style={styles.cardRow}>
                <MaterialIcons name="code" size={20} color="#f59e0b" />
                <Text style={styles.cardLabel}>Organization Code</Text>
              </View>
              <Text style={styles.cardValue}>{organization.organization_code}</Text>
            </View>
          </View>
        )}

        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {!editing && (
              <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                <MaterialIcons name="edit" size={20} color="#10b981" />
              </TouchableOpacity>
            )}
          </View>

          {editing ? (
            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.first_name}
                  onChangeText={(text) => setEditForm({ ...editForm, first_name: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Middle Name</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.middle_name}
                  onChangeText={(text) => setEditForm({ ...editForm, middle_name: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.last_name}
                  onChangeText={(text) => setEditForm({ ...editForm, last_name: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contact Number</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.contact_number}
                  onChangeText={(text) => setEditForm({ ...editForm, contact_number: text })}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.address}
                  onChangeText={(text) => setEditForm({ ...editForm, address: text })}
                  multiline
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>First Name</Text>
                <Text style={styles.infoValue}>{user?.first_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Middle Name</Text>
                <Text style={styles.infoValue}>{user?.middle_name || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Name</Text>
                <Text style={styles.infoValue}>{user?.last_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contact Number</Text>
                <Text style={styles.infoValue}>{user?.contact_number || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{user?.address || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Role</Text>
                <Text style={styles.infoValue}>President</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                </Text>
              </View>
            </View>
          )}
        </View>


        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={20} color="#ef4444" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

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
  headerBackground: {
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 20,
  },
  headerOverlay: {
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'white',
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(73, 99, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10b981',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    padding: 20,
    marginTop: -40,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    marginLeft: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
  },
});
