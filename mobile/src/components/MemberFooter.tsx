import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function MemberFooter() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/organization/member") {
      return pathname === "/organization/member" || pathname === "/organization/member/index";
    }
    return pathname === path;
  };

  const mainNavItems = [
    { label: "Home",    icon: "home",   path: "/organization/member",               key: "home"          },
    { label: "Notification", icon: "notifications", path: "/organization/member/notification", key: "notification" },
    { label: "Profile", icon: "person", path: "/organization/member/profile", key: "profile" },
  ];

  const geoTagPath = "/organization/member/geo-tag-tree";
  const isGeoActive = isActive(geoTagPath);

  return (
    <View style={styles.outerWrapper} pointerEvents="box-none">

      {/* FLOATING GEO-TAG BUTTON */}
      <TouchableOpacity
        style={[styles.floatingButton, isGeoActive && styles.activeFloatingButton]}
        onPress={() => router.push(geoTagPath as any)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.footerContainer}>
        <View style={styles.footerBar}>
          {mainNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <TouchableOpacity
                key={item.key}
                style={styles.iconContainer}
                onPress={() => router.push(item.path as any)}
              >
                <MaterialIcons
                  name={item.icon as any}
                  size={24}
                  color={active ? "#10b981" : "#9ca3af"}
                />
                <Text style={[styles.label, active && styles.activeLabel]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    justifyContent: "flex-end",
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  footerBar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 30,
    paddingVertical: 12,
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  floatingButton: {
    position: "absolute",
    right: 30,
    bottom: 120,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#065f46",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  activeFloatingButton: {
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  label: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 4,
    fontWeight: "500",
  },
  activeLabel: {
    color: "#10b981",
    fontWeight: "700",
  },
});