import { useAuth } from "../context/AuthContext";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";

export default function DashboardScreen() {
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        CircuitIQ Dashboard
      </Text>

      <Pressable
        onPress={handleSignOut}
        style={({ pressed }) => [
          styles.signOutButton,
          pressed && styles.signOutButtonPressed,
        ]}
      >
        <Text style={styles.signOutButtonText}>
          Sign Out
        </Text>
      </Pressable>
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

  signOutButton: {
    borderWidth: 1,
    borderColor: "#F4C430",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
  },

  signOutButtonPressed: {
    opacity: 0.7,
  },

  signOutButtonText: {
    color: "#F4C430",
    fontWeight: "700",
  },
});