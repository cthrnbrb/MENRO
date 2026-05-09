import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import PresidentFooter from "@/src/components/PresidentFooter";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

// Mock notifications for president
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "New Join Request",
    message: "John Doe has requested to join your organization.",
    type: "join_request",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: 2,
    title: "Activity Reminder",
    message: "Planting activity scheduled for tomorrow at Barangay 1.",
    type: "activity_reminder",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: 3,
    title: "Monitoring Report",
    message: "Monthly monitoring report is ready for review.",
    type: "monitoring_schedule",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 4,
    title: "Certificate Generated",
    message: "Certificates for recent planting activity have been generated.",
    type: "certificate_ready",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 5,
    title: "Member Milestone",
    message: "Your organization has reached 50 members!",
    type: "join_accepted",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

export default function PresidentNotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.is_read) {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notification.id ? { ...notif, is_read: true } : notif
        )
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "join_request":
        return "person-add";
      case "join_accepted":
        return "check-circle";
      case "join_rejected":
        return "cancel";
      case "activity_reminder":
        return "event";
      case "activity_rescheduled":
        return "event-note";
      case "activity_cancelled":
        return "event-busy";
      case "monitoring_schedule":
        return "schedule";
      case "monitoring_reassigned":
        return "swap-horiz";
      case "tree_update_reminder":
        return "nature";
      case "certificate_ready":
        return "card-membership";
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "join_request":
        return "#6366f1";
      case "join_accepted":
        return "#10b981";
      case "join_rejected":
        return "#ef4444";
      case "activity_reminder":
        return "#f59e0b";
      case "activity_rescheduled":
        return "#3b82f6";
      case "activity_cancelled":
        return "#ef4444";
      case "monitoring_schedule":
        return "#8b5cf6";
      case "monitoring_reassigned":
        return "#ec4899";
      case "tree_update_reminder":
        return "#10b981";
      case "certificate_ready":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* NOTIFICATIONS LIST */}
        <View style={styles.notificationsSection}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="notifications-none" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>No notifications yet</Text>
              <Text style={styles.emptySubtext}>
                You'll see updates here
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.is_read && styles.unreadCard
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <View style={styles.notificationIconContainer}>
                    <MaterialIcons
                      name={getNotificationIcon(notification.type)}
                      size={24}
                      color={getNotificationColor(notification.type)}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {formatDate(notification.created_at)}
                    </Text>
                  </View>
                  {!notification.is_read && (
                    <View style={styles.unreadDot} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <PresidentFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  
  // Notifications
  notificationsSection: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 24, fontWeight: "700", color: "#1e293b", marginBottom: 15 },
  notificationsList: { paddingBottom: 20 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#6b7280",
    marginTop: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    backgroundColor: "#f0fdf4",
    borderColor: "#10b981",
  },
  notificationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 4,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
    marginLeft: 8,
  },
});
