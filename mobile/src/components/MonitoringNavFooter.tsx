import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface MonitoringNavFooterProps {
  currentRoute?: string;
}

export default function MonitoringNavFooter({ currentRoute }: MonitoringNavFooterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    const currentPath = currentRoute || pathname;
    return currentPath?.includes(route);
  };

  return (
    <View style={styles.container}>
      {/* Floating Plus Button - Right Side */}
      <TouchableOpacity
        style={styles.floatingPlusButton}
        onPress={() => router.push("/monitoring/add" as any)}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.footer}>
        {/* Home */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/monitoring" as any)}
        >
          <MaterialIcons name="home" size={22} color={isActive("index") ? "#10b981" : "#6b7280"} />
          <Text style={[styles.navText, isActive("index") && styles.activeText]}>Home</Text>
        </TouchableOpacity>

        {/* Map */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/monitoring/map" as any)}
        >
          <MaterialIcons name="location-on" size={22} color={isActive("map") ? "#10b981" : "#6b7280"} />
          <Text style={[styles.navText, isActive("map") && styles.activeText]}>Map</Text>
        </TouchableOpacity>

        {/* Assignment */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/monitoring/assignment" as any)}
        >
          <MaterialIcons name="description" size={22} color={isActive("assignment") ? "#10b981" : "#6b7280"} />
          <Text style={[styles.navText, isActive("assignment") && styles.activeText]}>Assignment</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/monitoring/notifications" as any)}
        >
          <MaterialIcons name="notifications" size={22} color={isActive("notifications") ? "#10b981" : "#6b7280"} />
          <Text style={[styles.navText, isActive("notifications") && styles.activeText]}>Alert</Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/monitoring/profile" as any)}
        >
          <MaterialIcons name="person" size={22} color={isActive("profile") ? "#10b981" : "#6b7280"} />
          <Text style={[styles.navText, isActive("profile") && styles.activeText]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 16,
  },
  footer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingBottom: 12,
    borderRadius: 24,
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  floatingPlusButton: {
    position: "absolute",
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 4,
    borderColor: "#f5f5f5",
    zIndex: 10,
  },
  navText: {
    fontSize: 11,
    marginTop: 4,
    color: "#6b7280",
  },
  activeText: {
    color: "#10b981",
    fontWeight: "600",
  },
});
