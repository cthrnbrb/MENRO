import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <View style={styles.container}>
      <View style={styles.footer}>

        {/* LEFT ICON */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => router.push("/planters/my-trees")}
        >
          <MaterialIcons
            name="home"
            size={24}
            color={isActive("/planters/my-trees") ? "#10b981" : "#9ca3af"}
          />
          <Text style={[styles.label, isActive("/planters/my-trees") && styles.activeLabel]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* RIGHT ICON */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => router.push("/planters/profile")}
        >
          <MaterialIcons
            name="person"
            size={24}
            color={isActive("/planters/profile") ? "#10b981" : "#9ca3af"}
          />
          <Text style={[styles.label, isActive("/planters/profile") && styles.activeLabel]}>
            Profile
          </Text>
        </TouchableOpacity>

        {/* CENTER FLOATING BUTTON */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/planters")}
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