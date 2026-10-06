import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../context/AuthContext";

type IconName = ComponentProps<typeof Ionicons>["name"];

type MetricCardProps = {
  icon: IconName;
  label: string;
  value: string;
  valueColor?: string;
  onPress: () => void;
};

type ActivityItem = {
  asset: string;
  description: string;
  date: string;
  icon: IconName;
};

type NavItemProps = {
  icon: IconName;
  label: string;
  active?: boolean;
  onPress: () => void;
};

/*
  TEMPORARY PLACEHOLDER DATA

  This will eventually be replaced with data
  returned from the CircuitIQ backend/PostgreSQL.
*/
const recentActivity: ActivityItem[] = [
  {
    asset: "ASSET-001",
    description: "Scan completed",
    date: "MM/DD/YYYY",
    icon: "scan-outline",
  },
  {
    asset: "ASSET-002",
    description: "Inspection completed",
    date: "MM/DD/YYYY",
    icon: "clipboard-outline",
  },
  {
    asset: "ASSET-003",
    description: "Work order created",
    date: "MM/DD/YYYY",
    icon: "construct-outline",
  },
];

function MetricCard({
  icon,
  label,
  value,
  valueColor = "#FFFFFF",
  onPress,
}: MetricCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.metricCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.metricIcon}>
        <Ionicons
          name={icon}
          size={24}
          color="#E8EEF6"
        />
      </View>

      <View style={styles.metricText}>
        <Text style={styles.metricLabel}>
          {label}
        </Text>

        <Text
          style={[
            styles.metricValue,
            { color: valueColor },
          ]}
        >
          {value}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#8290A2"
      />
    </Pressable>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onPress,
}: NavItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navItem,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={23}
        color={
          active ? "#278CFF" : "#8B97A8"
        }
      />

      <Text
        style={[
          styles.navLabel,
          active && styles.navLabelActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const { logout } = useAuth();

  /*
    Temporary handler for features that have
    not been implemented yet.
  */
  const comingSoon = (feature: string) => {
    Alert.alert(
      feature,
      `${feature} has not been implemented yet.`
    );
  };

  /*
    Temporary account menu.

    Sign Out remains functional while the
    full Account / More screen is still
    under development.
  */
  const handleAccount = () => {
    Alert.alert(
      "Account",
      "Account functionality will be added in a future feature.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",

          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error(
                "Sign out failed:",
                error
              );

              Alert.alert(
                "Sign Out Failed",
                "Unable to sign out. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            Circuit
            <Text style={styles.logoAccent}>
              IQ
            </Text>
          </Text>

          <Pressable
            onPress={handleAccount}
            style={({ pressed }) => [
              styles.avatar,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.avatarText}>
              FN
            </Text>
          </Pressable>
        </View>

        {/* USER / COMPANY PLACEHOLDERS */}
        <View style={styles.welcome}>
          <Text style={styles.greeting}>
            Good morning,
          </Text>

          <Text style={styles.name}>
            First Name
          </Text>

          <Text style={styles.company}>
            Company Name
          </Text>
        </View>

        {/* PRIMARY SCAN ACTION */}
        <Pressable
          onPress={() =>
            comingSoon("Scan Equipment")
          }
          style={({ pressed }) => [
            styles.scanButton,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.scanIcon}>
            <Ionicons
              name="camera-outline"
              size={31}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.scanText}>
            Scan Equipment
          </Text>

          <Ionicons
            name="chevron-forward"
            size={27}
            color="#FFFFFF"
          />
        </Pressable>

        {/* DASHBOARD SUMMARY */}
        <View style={styles.metricsGrid}>
          <MetricCard
            icon="cube-outline"
            label="Assets"
            value="000"
            onPress={() =>
              comingSoon("Assets")
            }
          />

          <MetricCard
            icon="clipboard-outline"
            label="Inspections"
            value="0 Due"
            valueColor="#F4C430"
            onPress={() =>
              comingSoon("Inspections")
            }
          />

          <MetricCard
            icon="construct-outline"
            label="Work Orders"
            value="0 Open"
            valueColor="#35DF84"
            onPress={() =>
              comingSoon("Work Orders")
            }
          />

          <MetricCard
            icon="camera-outline"
            label="Scans"
            value="00"
            onPress={() =>
              comingSoon("Scans")
            }
          />
        </View>

        {/* RECENT ACTIVITY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Recent Activity
          </Text>

          <Pressable
            onPress={() =>
              comingSoon("Activity History")
            }
          >
            <Text style={styles.viewAll}>
              View All
            </Text>
          </Pressable>
        </View>

        <View style={styles.activityCard}>
          {recentActivity.map(
            (activity, index) => (
              <View key={activity.asset}>
                <Pressable
                  onPress={() =>
                    comingSoon(
                      activity.asset
                    )
                  }
                  style={({ pressed }) => [
                    styles.activityRow,
                    pressed && styles.pressed,
                  ]}
                >
                  <View
                    style={
                      styles.activityIcon
                    }
                  >
                    <Ionicons
                      name={activity.icon}
                      size={23}
                      color="#E8EEF6"
                    />
                  </View>

                  <View
                    style={
                      styles.activityInfo
                    }
                  >
                    <Text
                      style={
                        styles.activityAsset
                      }
                    >
                      {activity.asset}
                    </Text>

                    <Text
                      style={
                        styles.activityDescription
                      }
                    >
                      {
                        activity.description
                      }
                    </Text>

                    <Text
                      style={
                        styles.activityDate
                      }
                    >
                      {activity.date}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#8290A2"
                  />
                </Pressable>

                {index <
                  recentActivity.length -
                    1 && (
                  <View
                    style={styles.divider}
                  />
                )}
              </View>
            )
          )}
        </View>

        {/* Keeps content above bottom navigation */}
        <View style={styles.scrollSpacer} />
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNav}>
        <NavItem
          icon="home"
          label="Home"
          active
          onPress={() => {}}
        />

        <NavItem
          icon="cube-outline"
          label="Assets"
          onPress={() =>
            comingSoon("Assets")
          }
        />

        <NavItem
          icon="camera-outline"
          label="Scan"
          onPress={() =>
            comingSoon("Scan")
          }
        />

        <NavItem
          icon="clipboard-outline"
          label="Inspections"
          onPress={() =>
            comingSoon("Inspections")
          }
        />

        <NavItem
          icon="ellipsis-horizontal"
          label="More"
          onPress={() =>
            comingSoon("More")
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080D12",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },

  /*
    Header
  */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1,
  },

  logoAccent: {
    color: "#278CFF",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#334155",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  /*
    Welcome section
  */

  welcome: {
    marginBottom: 22,
  },

  greeting: {
    color: "#A7B0BC",
    fontSize: 17,
    marginBottom: 1,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 39,
  },

  company: {
    color: "#B5BFCC",
    fontSize: 17,
    marginTop: 1,
  },

  /*
    Scan equipment button
  */

  scanButton: {
    minHeight: 92,
    borderRadius: 18,
    backgroundColor: "#1484F6",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 18,
    marginBottom: 18,
  },

  scanIcon: {
    width: 54,
    height: 54,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(255,255,255,0.13)",

    marginRight: 15,
  },

  scanText: {
    flex: 1,

    color: "#FFFFFF",

    fontSize: 20,
    fontWeight: "800",
  },

  /*
    Dashboard metric cards
  */

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "space-between",

    rowGap: 11,

    marginBottom: 30,
  },

  metricCard: {
    width: "48.3%",

    minHeight: 102,

    padding: 13,

    borderRadius: 16,

    borderWidth: 1,
    borderColor: "#1C2936",

    backgroundColor: "#111922",

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 11,
  },

  metricIcon: {
    width: 43,
    height: 43,

    borderRadius: 13,

    backgroundColor: "#1D2936",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },

  metricText: {
    flex: 1,
  },

  metricLabel: {
    color: "#AFB9C5",

    fontSize: 12,
    fontWeight: "600",
  },

  metricValue: {
    fontSize: 22,
    fontWeight: "900",

    marginTop: 3,
  },

  /*
    Recent activity
  */

  sectionHeader: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 12,
  },

  sectionTitle: {
    color: "#FFFFFF",

    fontSize: 21,
    fontWeight: "900",
  },

  viewAll: {
    color: "#278CFF",

    fontSize: 14,
    fontWeight: "700",
  },

  activityCard: {
    backgroundColor: "#0F171F",

    borderWidth: 1,
    borderColor: "#1C2936",

    borderRadius: 16,

    overflow: "hidden",
  },

  activityRow: {
    minHeight: 91,

    paddingHorizontal: 14,
    paddingVertical: 13,

    flexDirection: "row",
    alignItems: "center",
  },

  activityIcon: {
    width: 53,
    height: 53,

    borderRadius: 13,

    backgroundColor: "#1D2936",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 13,
  },

  activityInfo: {
    flex: 1,
  },

  activityAsset: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "800",
  },

  activityDescription: {
    color: "#AFB8C5",

    fontSize: 14,

    marginTop: 3,
  },

  activityDate: {
    color: "#788493",

    fontSize: 12,

    marginTop: 3,
  },

  divider: {
    height: 1,

    backgroundColor: "#1D2936",

    marginLeft: 80,
  },

  scrollSpacer: {
    height: 105,
  },

  /*
    Bottom navigation
  */

  bottomNav: {
    position: "absolute",

    bottom: 0,
    left: 0,
    right: 0,

    height: 80,

    paddingBottom: 7,

    backgroundColor: "#0B1118",

    borderTopWidth: 1,
    borderTopColor: "#1D2936",

    flexDirection: "row",
    alignItems: "center",
  },

  navItem: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  navLabel: {
    color: "#8B97A8",

    fontSize: 10,
    fontWeight: "600",

    marginTop: 4,
  },

  navLabelActive: {
    color: "#278CFF",
  },

  pressed: {
    opacity: 0.7,
  },
});