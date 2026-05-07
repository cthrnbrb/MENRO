import { View, Text, StyleSheet } from "react-native";

export default function MonitoringInterventionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Interventions Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
  },
});
