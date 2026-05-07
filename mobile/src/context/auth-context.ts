import axios from "@/src/api/axios";
import { setToken } from "@/src/services/auth-storage";
import { Alert } from "react-native";
import { create } from "zustand";
import { router } from "expo-router";

interface User {
  id: string;
  email: string;
  role: 'admin' | 'monitoring staff' | 'president' | 'organization' | 'couple';
  first_name: string;
  middle_name?: string;
  last_name: string;
  contact_number?: string;
  address?: string;
  photo?: string;
  password?: string; // Hidden in responses
  created_at?: string;
  name?: string; // Computed from first_name, middle_name, last_name
}

interface Organization {
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
}

interface UserOrganization {
  id: string;
  user_id: string;
  organization_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at?: string;
  responded_at?: string;
  responded_by?: string;
  joined_at?: string;
  organization?: Organization;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  contact_number?: string;
  address?: string;
}

interface JoinOrganizationData {
  code: string;
}

interface AuthState {
  user: User | null;
  organizations: UserOrganization[];
  loading: boolean;
  getUser: () => Promise<void>;
  validateCode: (code: string) => Promise<boolean>;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  joinOrganization: (data: JoinOrganizationData) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  organizations: [],
  loading: false,

  getUser: async () => {
    try {
      const { data } = await axios.get("/user");
      set({ user: data });

      // Fetch user organizations
      try {
        const orgResponse = await axios.get(`/user/${data.id}/organizations`);
        if (orgResponse.data && orgResponse.data.length > 0) {
          set({ organizations: orgResponse.data });
        }
      } catch (error) {
        console.log("User organization data not found");
      }
    } catch (error) {
      console.log(error);
    }
  },

  validateCode: async (code: string) => {
    try {
      console.log("Validating code:", code);
      console.log("Base URL:", axios.defaults.baseURL);
      
      const { data } = await axios.post("/validate-code", { code });
      console.log("Validation response:", data);
      return data.valid;
    } catch (error: any) {
      console.error("Validation error:", error);
      console.error("Error status:", error.response?.status);
      console.error("Error response:", error.response?.data);
      console.error("Network error:", error.request ? 'Network request failed' : 'No request made');
      
      // Show more detailed error message
      let errorMessage = "Invalid code";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = "Cannot connect to server. Please check your internet connection.";
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = "Network error. Please check if the server is running.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
      return false;
    }
  },

  login: async (data) => {
    try {
      set({ loading: true });
      const response = await axios.post("/login", data);
      await setToken(response.data.token);
      
      // Set user and organizations from response
      set({ 
        user: response.data.user,
        organizations: response.data.organizations || []
      });
      
      // Check if user has organizations
      if (response.data.organizations && response.data.organizations.length > 0) {
        // User has organizations, redirect based on user role
        const userRole = response.data.user.role;
        console.log('User role:', userRole);
        switch (userRole) {
          case 'organization':
            router.replace('/planters/my-trees' as any);
            break;
          case 'monitoring staff':
            router.replace('/monitoring' as any);
            break;
          case 'admin':
            router.replace('/planters/my-trees' as any);
            break;
          case 'couple':
            router.replace('/planters/my-trees' as any);
            break;
          default:
            router.replace('/planters/my-trees' as any);
        }
      } else {
        // User has no organizations, redirect to code page to join
        router.replace('/code' as any);
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Invalid credentials');
    } finally {
      set({ loading: false });
    }
  },

  register: async (data) => {
    try {
      set({ loading: true });
      await axios.post("/register", data);
      Alert.alert('Success', 'Registration successful! Please login to join an organization.');
      router.replace('/login');
    } catch (error: any) {
      console.log("Registration error:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.keys(errors)[0];
        const errorMessage = Array.isArray(errors[firstError]) 
          ? errors[firstError][0] 
          : errors[firstError];
        Alert.alert('Registration Error', errorMessage);
      } else if (error.response?.data?.message) {
        Alert.alert('Registration Error', error.response.data.message);
      } else {
        Alert.alert('Registration Error', 'Registration failed. Please try again.');
      }
    } finally {
      set({ loading: false });
    }
  },

  joinOrganization: async (data) => {
    try {
      set({ loading: true });
      const response = await axios.post("/join-organization", data);

      const userId = get().user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Add the new organization to the list with pending status
      const newOrg: UserOrganization = {
        id: response.data.data.organization.id,
        user_id: userId,
        organization_id: response.data.data.organization.id,
        status: 'pending',
        requested_at: new Date().toISOString(),
        organization: response.data.data.organization
      };

      set({ organizations: [...get().organizations, newOrg] });

      Alert.alert('Success', 'Join request submitted. Waiting for president approval.');

      // Redirect based on user role
      const userRole = get().user?.role;
      switch (userRole) {
        case 'organization':
          router.replace('/planters/my-trees' as any);
          break;
        case 'monitoring staff':
          router.replace('/monitoring' as any);
          break;
        case 'admin':
          router.replace('/planters/my-trees' as any);
          break;
        case 'couple':
          router.replace('/planters/my-trees' as any);
          break;
        case 'president':
          router.replace('/planters/my-trees' as any);
          break;
        default:
          router.replace('/planters/my-trees' as any);
      }
    } catch (error: any) {
      console.log("Join organization error:", error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit join request');
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await axios.post("/logout");
      await setToken(null);
      set({
        user: null,
        organizations: []
      });
      router.replace('/login');
    } catch (error) {
      console.log(error);
    }
  },
}));
