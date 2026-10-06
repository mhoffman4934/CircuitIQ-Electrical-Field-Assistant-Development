import { router } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CircuitIQ Dashboard</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F14",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 30,
  },

  button: {
    borderWidth: 1,
    borderColor: "#F4C430",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
  },

  buttonText: {
    color: "#F4C430",
    fontWeight: "700",
  },
});