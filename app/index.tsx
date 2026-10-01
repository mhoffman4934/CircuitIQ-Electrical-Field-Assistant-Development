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
      newErrors.password =
        "Password must contain at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      return;
    }

    // Sprint 1 mock authentication.
    router.replace("/dashboard");
  };

  const handleBiometrics = () => {
    Alert.alert(
      "Biometric Authentication",
      "Biometric authentication will be implemented in a future CircuitIQ sprint."
    );
  };

  const handleEmployeeId = () => {
    Alert.alert(
      "Employee ID Scanner",
      "Employee ID scanning will be implemented in a future CircuitIQ sprint."
    );
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Password Recovery",
      "Password recovery will be connected to the CircuitIQ authentication service."
    );
  };

  const handleSupport = () => {
    Alert.alert(
      "CircuitIQ Support",
      "The CircuitIQ support portal will be connected in a future sprint."
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
          {/* HEADER */}

          <View style={styles.header}>
            <View>
              <Text style={styles.brand}>
                CIRCUIT
                <Text style={styles.brandAccent}>IQ</Text>
              </Text>

              <Text style={styles.brandSubtitle}>
                ELECTRICAL FIELD INTELLIGENCE SUPPORT
              </Text>
            </View>

            <View style={styles.logoBox}>
              <Text style={styles.logoText}>⚡</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            Secure access for the field.
          </Text>

          <Text style={styles.heroSubtitle}>
            Access electrical assets, inspections logs, scans, and field tools
            from one secure workspace.
          </Text>

          {/* LOGIN CARD */}

          <View style={styles.card}>
            <Text style={styles.title}>Sign In</Text>

            <Text style={styles.description}>
              Enter your CircuitIQ account credentials to continue.
            </Text>

            {/* EMAIL */}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>

              <View
                style={[
                  styles.inputContainer,
                  errors.email ? styles.inputError : undefined,
                ]}
              >
                <Text style={styles.inputIcon}>@</Text>

                <TextInput
                  style={styles.input}
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
                  placeholderTextColor="#687382"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                />
              </View>

              {errors.email ? (
                <Text style={styles.errorText}>
                  {errors.email}
                </Text>
              ) : null}
            </View>

            {/* PASSWORD */}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PASSWORD</Text>

              <View
                style={[
                  styles.inputContainer,
                  errors.password ? styles.inputError : undefined,
                ]}
              >
                <Text style={styles.passwordIcon}>●</Text>

                <TextInput
                  style={styles.input}
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
                  placeholderTextColor="#687382"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                />

                <Pressable
                  onPress={() =>
                    setShowPassword((current) => !current)
                  }
                  hitSlop={10}
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

            <Pressable
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>
                Forgot password?
              </Text>
            </Pressable>

            {/* SIGN IN */}

            <Pressable
              style={({ pressed }) => [
                styles.signInButton,
                pressed && styles.signInPressed,
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.signInText}>Sign In</Text>
              <Text style={styles.signInArrow}>→</Text>
            </Pressable>

            {/* DIVIDER */}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* FUTURE AUTH */}

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryPressed,
              ]}
              onPress={handleBiometrics}
            >
              <View style={styles.secondaryIconBox}>
                <Text style={styles.secondaryIcon}>◎</Text>
              </View>

              <Text style={styles.secondaryText}>
                Use Biometrics
              </Text>

              <Text style={styles.secondaryArrow}>›</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryPressed,
              ]}
              onPress={handleEmployeeId}
            >
              <View style={styles.secondaryIconBox}>
                <Text style={styles.secondaryIcon}>▦</Text>
              </View>

              <Text style={styles.secondaryText}>
                Scan Employee ID
              </Text>

              <Text style={styles.secondaryArrow}>›</Text>
            </Pressable>

            {/* FIELD PANEL */}

            <View style={styles.fieldPanel}>
              <View style={styles.fieldIconContainer}>
                <Text style={styles.fieldIcon}>⚡</Text>
              </View>

              <View style={styles.fieldPanelContent}>
                <Text style={styles.fieldPanelTitle}>
                  Built for the Field
                </Text>

                <Text style={styles.fieldPanelDescription}>
                  Fast, secure access for electrical professionals
                  wherever the job takes you.
                </Text>
              </View>
            </View>

            {/* MFA */}

            <View style={styles.mfaPanel}>
              <View style={styles.mfaIndicator}>
                <Text style={styles.mfaCheck}>✓</Text>
              </View>

              <View style={styles.mfaContent}>
                <Text style={styles.mfaTitle}>
                  MFA Ready
                </Text>

                <Text style={styles.mfaDescription}>
                  CircuitIQ authentication is structured to support
                  multi-factor authentication in a future sprint.
                </Text>
              </View>
            </View>
          </View>

          {/* SUPPORT */}

          <View style={styles.supportSection}>
            <Text style={styles.supportText}>
              Need access to CircuitIQ?
            </Text>

            <Pressable onPress={handleSupport}>
              <Text style={styles.supportLink}>
                Support Portal
              </Text>
            </Pressable>
          </View>

          <Text style={styles.version}>
            CIRCUITIQ v0.1.0
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
    backgroundColor: "#06080D",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 28,
  },

  // HEADER

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 34,
  },

  brand: {
    color: "#F4F6F8",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 3.4,
  },

  brandAccent: {
    color: "#F2B233",
  },

  brandSubtitle: {
    color: "#8F99A6",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginTop: 5,
  },

  logoBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#151C25",
    borderWidth: 1,
    borderColor: "#384556",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    fontSize: 22,
  },

  heroTitle: {
    color: "#F4F6F8",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
  },

  heroSubtitle: {
    color: "#8F99A6",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 9,
    marginBottom: 28,
  },

  // CARD

  card: {
    backgroundColor: "#10151D",
    borderWidth: 1,
    borderColor: "#2A3442",
    borderRadius: 24,
    padding: 22,
  },

  title: {
    color: "#F4F6F8",
    fontSize: 28,
    fontWeight: "800",
  },

  description: {
    color: "#A3AFBD",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 26,
  },

  // FORM

  fieldGroup: {
    marginBottom: 18,
  },

  label: {
    color: "#A3AFBD",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 9,
  },

  inputContainer: {
    height: 55,
    backgroundColor: "#161D27",
    borderWidth: 1,
    borderColor: "#384556",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  inputError: {
    borderColor: "#DF5959",
  },

  inputIcon: {
    color: "#E86A2E",
    fontSize: 15,
    fontWeight: "900",
    width: 23,
    marginRight: 8,
    textAlign: "center",
  },

  passwordIcon: {
    color: "#E86A2E",
    fontSize: 10,
    width: 23,
    marginRight: 8,
    textAlign: "center",
  },

  input: {
    flex: 1,
    color: "#F4F6F8",
    fontSize: 14,
    paddingVertical: 0,
  },

  passwordToggle: {
    color: "#F2B233",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginLeft: 10,
  },

  errorText: {
    color: "#DF5959",
    fontSize: 11,
    marginTop: 7,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -2,
    marginBottom: 22,
  },

  forgotPasswordText: {
    color: "#F2B233",
    fontSize: 12,
    fontWeight: "700",
  },

  // SIGN IN

  signInButton: {
    height: 56,
    backgroundColor: "#F2B233",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
  },

  signInPressed: {
    backgroundColor: "#D99A1E",
    transform: [{ scale: 0.99 }],
  },

  signInText: {
    color: "#06080D",
    fontSize: 15,
    fontWeight: "900",
  },

  signInArrow: {
    position: "absolute",
    right: 18,
    color: "#06080D",
    fontSize: 24,
  },

  // DIVIDER

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#384556",
  },

  dividerText: {
    color: "#6F7B88",
    fontSize: 10,
    fontWeight: "700",
    marginHorizontal: 14,
  },

  // SECONDARY AUTH

  secondaryButton: {
    height: 52,
    backgroundColor: "#0D131A",
    borderWidth: 1,
    borderColor: "#384556",
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 11,
  },

  secondaryPressed: {
    backgroundColor: "#151E28",
  },

  secondaryIconBox: {
    width: 30,
    alignItems: "center",
    marginRight: 9,
  },

  secondaryIcon: {
    color: "#E86A2E",
    fontSize: 20,
    fontWeight: "800",
  },

  secondaryText: {
    flex: 1,
    color: "#F4F6F8",
    fontSize: 13,
    fontWeight: "600",
  },

  secondaryArrow: {
    color: "#A3AFBD",
    fontSize: 25,
  },

  // FIELD PANEL

  fieldPanel: {
    backgroundColor: "#0D131A",
    borderWidth: 1,
    borderColor: "#2A3442",
    borderRadius: 13,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  fieldIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#291A0F",
    borderWidth: 1,
    borderColor: "#553019",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  fieldIcon: {
    fontSize: 20,
  },

  fieldPanelContent: {
    flex: 1,
  },

  fieldPanelTitle: {
    color: "#F4F6F8",
    fontSize: 13,
    fontWeight: "800",
  },

  fieldPanelDescription: {
    color: "#6F7B88",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  // MFA

  mfaPanel: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#202A35",
  },

  mfaIndicator: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#14231A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  mfaCheck: {
    color: "#54B36A",
    fontSize: 15,
    fontWeight: "900",
  },

  mfaContent: {
    flex: 1,
  },

  mfaTitle: {
    color: "#54B36A",
    fontSize: 11,
    fontWeight: "800",
  },

  mfaDescription: {
    color: "#6F7B88",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 2,
  },

  // FOOTER

  supportSection: {
    alignItems: "center",
    marginTop: 23,
  },

  supportText: {
    color: "#6F7B88",
    fontSize: 11,
  },

  supportLink: {
    color: "#F2B233",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 5,
  },

  version: {
    color: "#4B5662",
    fontSize: 9,
    letterSpacing: 1.2,
    textAlign: "center",
    marginTop: 17,
  },
});