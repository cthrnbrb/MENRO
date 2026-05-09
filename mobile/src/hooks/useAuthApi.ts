import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '@/src/api/axios';
import { setToken } from '@/src/services/auth-storage';
import { Alert } from 'react-native';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  role: "admin" | "monitoring staff" | "organization" | "couple";
  first_name: string;
  middle_name?: string;
  last_name: string;
  contact_number?: string;
  address?: string;
  photo?: string;
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
  org_role: "president" | "member";
  status: "pending" | "accepted" | "rejected" | "removed";
  requested_at?: string;
  responded_at?: string;
  responded_by?: string;
  joined_at?: string;
  removed_at?: string;
  removed_by?: string;
  removal_remarks?: string;
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

// Custom hook for getting user data
export function useGetUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await axios.get("/user");
      return data;
    },
    retry: 1,
  });
}

// Custom hook for getting user organizations
export function useUserOrganizations(userId: string) {
  return useQuery({
    queryKey: ['user-organizations', userId],
    queryFn: async () => {
      const { data } = await axios.get(`/user/${userId}/organizations`);
      return data;
    },
    enabled: !!userId,
    retry: 1,
  });
}

// Custom hook for validating organization code
export function useValidateCode() {
  return useMutation({
    mutationFn: async (code: string) => {
      const { data } = await axios.post("/validate-code", { code });
      return data.valid;
    },
    onError: (error: any) => {
      console.error("Validation error:", error);
      let errorMessage = "Invalid code";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === "ECONNREFUSED") {
        errorMessage = "Cannot connect to server. Please check your internet connection.";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please check if the server is running.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      Alert.alert("Error", errorMessage);
    },
  });
}

// Custom hook for login
export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await axios.post("/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      void setToken(data.token);
      
      const userRole = data.user.role;
      const organizations = data.organizations || [];

      switch (userRole) {
        case "couple":
          router.replace("/couples/my-trees" as any);
          break;
        case "organization":
          const acceptedOrg = organizations.find(
            (org: UserOrganization) => org.status === "accepted",
          );
          router.replace("/organization/dashboard" as any);
          break;
        case "monitoring staff":
          router.replace("/monitoring" as any);
          break;
        case "admin":
          router.replace("/couples/my-trees" as any);
          break;
        default:
          router.replace("/couples/my-trees" as any);
      }
    },
    onError: (error: any) => {
      let message = error.response?.data?.message || "Invalid credentials";
      if (error.code === "ECONNABORTED") {
        message = "Login request timed out. Please check server connection.";
      } else if (error.code === "ERR_NETWORK") {
        message = "Cannot reach server. Check your API IP address and internet.";
      }
      Alert.alert("Login Failed", message);
    },
  });
}

// Custom hook for registration
export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      await axios.post("/register", data);
    },
    onSuccess: () => {
      Alert.alert(
        "Success",
        "Registration successful! Please login to join an organization.",
      );
      router.replace("/login");
    },
    onError: (error: any) => {
      console.log("Registration error:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.keys(errors)[0];
        const errorMessage = Array.isArray(errors[firstError])
          ? errors[firstError][0]
          : errors[firstError];
        Alert.alert("Registration Error", errorMessage);
      } else if (error.response?.data?.message) {
        Alert.alert("Registration Error", error.response.data.message);
      } else {
        Alert.alert("Registration Error", "Registration failed. Please try again.");
      }
    },
  });
}

// Custom hook for joining organization
export function useJoinOrganization() {
  return useMutation({
    mutationFn: async (data: JoinOrganizationData) => {
      const response = await axios.post("/join-organization", data);
      return response.data;
    },
    onSuccess: (response, variables, context) => {
      Alert.alert(
        "Success",
        "Join request submitted. Waiting for president approval.",
      );
      router.replace("/organization/dashboard" as any);
    },
    onError: (error: any) => {
      console.log("Join organization error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to submit join request",
      );
    },
  });
}

// Custom hook for logout
export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await axios.post("/logout");
    },
    onSuccess: async () => {
      await setToken(null);
      router.replace("/login");
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
