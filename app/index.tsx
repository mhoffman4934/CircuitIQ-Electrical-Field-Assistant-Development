import { router } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CircuitIQ</Text>
      <Text style={styles.subtitle}>Login Screen</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/dashboard")}
      >
        <Text style={styles.buttonText}>Sign In</Text>
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
    color: "#F4C430",
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    color: "#FFFFFF",
    marginTop: 10,
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#F4C430",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
  },

  buttonText: {
    color: "#0B0F14",
    fontWeight: "800",
  },
});