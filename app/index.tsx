import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type LoginErrors = {
  email?: string;
  password?: string;
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const validateForm = () => {
    const newErrors: LoginErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      return;
    }

    /*
      Sprint 1 mock authentication.

      Sprint 2 will replace this with:
      Mobile App
          ↓
      Authentication API
          ↓
      Server validation
          ↓
      Secure token storage
          ↓
      Dashboard
    */

    router.replace("/dashboard");
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Password Recovery",
      "Password recovery will be connected to the CircuitIQ authentication service in the future ."
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand */}

          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoInner}>
                <Text style={styles.logoBolt}>⚡</Text>
              </View>
            </View>

            <Text style={styles.brandName}>CIRCUITIQ</Text>

            <Text style={styles.brandSubtitle}>
              ELECTRICAL FIELD INTELLIGENCE ASSISTANT
            </Text>
          </View>

          {/* Login Card */}

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.welcomeText}>Welcome back</Text>

              <Text style={styles.instructions}>
                Sign in to access electrical assets, inspection logs,
                equipment scans, and field intelligence support.
              </Text>
            </View>

            {/* Email */}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>

              <TextInput
                style={[
                  styles.input,
                  errors.email ? styles.inputError : undefined,
                ]}
                value={email}
                onChangeText={(value) => {
                  setEmail(value);

                  if (errors.email) {
                    setErrors((current) => ({
                      ...current,
                      email: undefined,
                    }));
                  }
                }}
                placeholder="name@company.com"
                placeholderTextColor="#596675"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                accessibilityLabel="Email address"
              />

              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Password */}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>PASSWORD</Text>

              <View
                style={[
                  styles.passwordContainer,
                  errors.password
                    ? styles.inputError
                    : undefined,
                ]}
              >
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);

                    if (errors.password) {
                      setErrors((current) => ({
                        ...current,
                        password: undefined,
                      }));
                    }
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor="#596675"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  accessibilityLabel="Password"
                />

                <Pressable
                  onPress={() =>
                    setShowPassword((current) => !current)
                  }
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <Text style={styles.passwordToggle}>
                    {showPassword ? "HIDE" : "SHOW"}
                  </Text>
                </Pressable>
              </View>

              {errors.password ? (
                <Text style={styles.errorText}>
                  {errors.password}
                </Text>
              ) : null}
            </View>

            {/* Password recovery */}

            <Pressable
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>
                Forgot password?
              </Text>
            </Pressable>

            {/* Sign In */}

            <Pressable
              style={({ pressed }) => [
                styles.signInButton,
                pressed && styles.signInButtonPressed,
              ]}
              onPress={handleLogin}
              accessibilityRole="button"
            >
              <Text style={styles.signInButtonText}>
                Sign In
              </Text>
            </Pressable>

            {/* Security */}

            <View style={styles.securityPanel}>
              <View style={styles.securityIcon}>
                <Text style={styles.securityIconText}>✓</Text>
              </View>

              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>
                  Secure Field Access
                </Text>

                <Text style={styles.securityDescription}>
                  Authentication protects access to CircuitIQ
                  electrical field data.
                </Text>
              </View>
            </View>
          </View>

          {/* Access notice */}

          <View style={styles.accessSection}>
            <Text style={styles.accessText}>
              Need access to CircuitIQ?
            </Text>

            <Pressable
              onPress={() =>
                Alert.alert(
                  "Account Access",
                  "Account provisioning will be managed by CircuitIQ administrators."
                )
              }
            >
              <Text style={styles.contactText}>
                Support Portal
              </Text>
            </Pressable>
          </View>

          {/* Sprint indicator */ }

          <View style={styles.environmentBadge}>
            <View style={styles.environmentDot} />

            <Text style={styles.environmentText}>
              SPRINT 1 • DEVELOPMENT ENVIRONMENT
            </Text>
          </View>

          <Text style={styles.footer}>
            CircuitIQ v0.1.0
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#090D12",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 32,
  },

  /*
   * Branding
   */

  brandSection: {
    alignItems: "center",
    marginBottom: 32,
  },

  logoContainer: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: "#121820",
    borderWidth: 1,
    borderColor: "#293440",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  logoInner: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#1B222B",
    justifyContent: "center",
    alignItems: "center",
  },

  logoBolt: {
    fontSize: 30,
  },

  brandName: {
    color: "#F4C430",
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: 4.5,
  },

  brandSubtitle: {
    color: "#718091",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginTop: 8,
  },

  /*
   * Card
   */

  card: {
    backgroundColor: "#121820",
    borderWidth: 1,
    borderColor: "#252F3A",
    borderRadius: 24,
    padding: 22,
  },

  cardHeader: {
    marginBottom: 26,
  },

  welcomeText: {
    color: "#F6F8FA",
    fontSize: 27,
    fontWeight: "800",
  },

  instructions: {
    color: "#8A96A5",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  /*
   * Form
   */

  fieldGroup: {
    marginBottom: 18,
  },

  fieldLabel: {
    color: "#84909D",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.25,
    marginBottom: 9,
  },

  input: {
    height: 54,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#2B3642",
    backgroundColor: "#0B1016",
    color: "#F6F8FA",
    fontSize: 15,
    paddingHorizontal: 16,
  },

  inputError: {
    borderColor: "#E05A5A",
  },

  passwordContainer: {
    height: 54,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#2B3642",
    backgroundColor: "#0B1016",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  passwordInput: {
    flex: 1,
    color: "#F6F8FA",
    fontSize: 15,
    paddingVertical: 0,
  },

  passwordToggle: {
    color: "#F4C430",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    marginLeft: 12,
  },

  errorText: {
    color: "#E05A5A",
    fontSize: 12,
    marginTop: 7,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -2,
    marginBottom: 24,
  },

  forgotPasswordText: {
    color: "#E8C348",
    fontSize: 13,
    fontWeight: "700",
  },

  /*
   * Sign in
   */

  signInButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#F4C430",
    justifyContent: "center",
    alignItems: "center",
  },

  signInButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  signInButtonText: {
    color: "#090D12",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.25,
  },

  /*
   * Security
   */

  securityPanel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D1319",
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
  },

  securityIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#15241A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  securityIconText: {
    color: "#54B36A",
    fontSize: 15,
    fontWeight: "900",
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    color: "#D8DEE5",
    fontSize: 12,
    fontWeight: "800",
  },

  securityDescription: {
    color: "#687584",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  /*
   * Bottom
   */

  accessSection: {
    alignItems: "center",
    marginTop: 24,
  },

  accessText: {
    color: "#707C8A",
    fontSize: 12,
  },

  contactText: {
    color: "#E8C348",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5,
  },

  environmentBadge: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#0F151C",
    borderRadius: 20,
  },

  environmentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#54B36A",
    marginRight: 8,
  },

  environmentText: {
    color: "#596675",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  footer: {
    color: "#414B56",
    fontSize: 10,
    textAlign: "center",
    marginTop: 14,
  },
});