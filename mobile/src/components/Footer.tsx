import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const isCouplesArea = pathname?.startsWith("/couples");
  const isPlantersArea = pathname?.startsWith("/planters");

  // Routes differ by role. The footer should not always navigate to planters screens.
  const homeRoute = isCouplesArea ? "/couples/my-trees" : "/planters/my-trees";
  const profileRoute = isCouplesArea ? "/couples/profile" : "/planters/profile";
  const fabRoute = isCouplesArea ? "/couples/update-tree" : "/planters";

  const homeActive = isActive(homeRoute);
  const profileActive = isActive(profileRoute);

  return (
    <View style={styles.container}>
      <View style={styles.footer}>

        {/* LEFT ICON */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => router.push(homeRoute)}
        >
          <MaterialIcons
            name="home"
            size={24}
            color={homeActive ? "#10b981" : "#9ca3af"}
          />
          <Text style={[styles.label, homeActive && styles.activeLabel]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* RIGHT ICON */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => router.push(profileRoute)}
        >
          <MaterialIcons
            name="person"
            size={24}
            color={profileActive ? "#10b981" : "#9ca3af"}
          />
          <Text style={[styles.label, profileActive && styles.activeLabel]}>
            Profile
          </Text>
        </TouchableOpacity>

        {/* CENTER FLOATING BUTTON */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push(fabRoute)}
        >
          <MaterialIcons name="add" size={26} color="#fff" />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ecfdf5",
    paddingBottom: 20,
  },
  footer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 30,
    paddingVertical: 14,
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  activeLabel: {
    color: "#10b981",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    top: -25,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});