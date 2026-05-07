import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

export default function MonitoringFooter() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/monitoring/index" as any)}
      >
        <MaterialIcons name="map" size={24} color="#10b981" />
        <Text style={styles.navText}>Map</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/monitoring/interventions" as any)}
      >
        <FontAwesome name="tasks" size={24} color="#6b7280" />
        <Text style={styles.navText}>Interventions</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/monitoring/plots" as any)}
      >
        <MaterialIcons name="landscape" size={24} color="#6b7280" />
        <Text style={styles.navText}>Plots</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/monitoring/add" as any)}
      >
        <View style={styles.addButton}>
          <MaterialIcons name="add" size={24} color="white" />
        </View>
        <Text style={styles.navText}>Add</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/monitoring/profile" as any)}
      >
        <MaterialIcons name="person" size={24} color="#6b7280" />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 11,
    marginTop: 4,
    color: "#6b7280",
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
});
