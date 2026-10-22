import { useState, type ComponentProps } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useApiResource } from '../hooks/useApiResource';
import { Action, LoadState, colors, ui } from '../components/Screen';
import type { Dashboard } from '../types/api';

type Icon = ComponentProps<typeof Ionicons>['name'];
function Metric({ icon, label, value, onPress }: { icon: Icon; label: string; value: string; onPress?: () => void }) {
  return <Pressable accessibilityRole={onPress ? 'button' : undefined} disabled={!onPress} accessibilityState={{ disabled: !onPress }}
    onPress={onPress} style={({ pressed }) => [styles.metric, pressed && { opacity: 0.65 }]}>
    <Ionicons name={icon} size={24} color={onPress ? colors.blue : colors.muted} />
    <Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text>
  </Pressable>;
}

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const { data, error, loading, reload } = useApiResource<Dashboard>('/dashboard');
  const [signingOut, setSigningOut] = useState(false);
  const displayName = user?.displayName?.trim() || user?.email?.split('@')[0] || 'Welcome';
  const initials = displayName.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning,' : hour < 18 ? 'Good afternoon,' : 'Good evening,';
  const hasWorkspace = !!data?.workspace && !loading;

  const account = () => {
    if (signingOut) return;
    Alert.alert(user?.displayName || 'Your account', user?.email || 'Signed in', [
      { text: 'Close', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        setSigningOut(true);
        try { await logout(); }
        catch { Alert.alert('Sign Out Failed', 'Unable to sign out. Please try again.'); }
        finally { setSigningOut(false); }
      } },
    ]);
  };

  return <SafeAreaView style={styles.container}>
    <StatusBar style="light" />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void reload()} tintColor={colors.blue} colors={[colors.blue]} />}>
      <View style={styles.header}>
        <Text style={styles.logo}>Circuit<Text style={{ color: colors.blue }}>IQ</Text></Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Account and sign out" disabled={signingOut} onPress={account} style={styles.avatar}>
          <Text style={styles.avatarText}>{signingOut ? '…' : initials}</Text>
        </Pressable>
      </View>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.name}>{displayName}</Text>
      {data?.workspace && <Text style={styles.company}>{data.workspace.name}</Text>}
      <View style={{ height: 20 }} />
      <LoadState loading={loading && !data} error={error} retry={() => void reload()} />
      {!loading && data && !data.workspace && <View style={ui.card}>
        <Text style={ui.heading}>Your workspace starts here</Text>
        <Text style={ui.body}>Add your organization and first site to keep your equipment records together.</Text>
        <Action label="Set up workspace" onPress={() => router.push('/workspace')} />
      </View>}
      {hasWorkspace && <Action label="Add equipment" onPress={() => router.push('/assets/new')} />}
      <View style={styles.scanCard}>
        <Ionicons name="camera-outline" size={30} color={colors.muted} />
        <View style={{ flex: 1 }}><Text style={ui.heading}>Scan Equipment</Text><Text style={styles.planned}>Planned</Text></View>
      </View>
      <View style={styles.metrics}>
        <Metric icon="cube-outline" label="Assets" value={data && !loading ? String(data.assetCount) : '—'}
          onPress={hasWorkspace ? () => router.push('/assets') : undefined} />
        <Metric icon="clipboard-outline" label="Inspections" value="Planned" />
        <Metric icon="construct-outline" label="Work Orders" value="Planned" />
        <Metric icon="camera-outline" label="Scans" value="Planned" />
      </View>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {!loading && data && data.recentActivity.length === 0 && <View style={ui.card}>
        <Text style={ui.body}>No activity yet. Saved equipment records will appear here.</Text>
      </View>}
      {!loading && data?.recentActivity.map(activity => <Pressable key={activity.id} accessibilityRole="button" style={styles.activity}
        onPress={() => router.push({ pathname: '/assets/[id]', params: { id: activity.asset.id } })}>
        <View style={styles.activityIcon}><Ionicons name="cube-outline" size={24} color={colors.blue} /></View>
        <View style={{ flex: 1 }}>
          <Text style={ui.heading}>{activity.asset.assetTag}</Text>
          <Text style={styles.activityText}>{activity.action === 'ASSET_CREATED' ? 'Asset added' : 'Asset updated'} · {activity.asset.name}</Text>
          <Text style={styles.activityDate}>{new Date(activity.createdAt).toLocaleString()}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
      </Pressable>)}
    </ScrollView>
    <View style={styles.bottomNav}>
      <Pressable accessibilityRole="button" accessibilityState={{ selected: true }} accessibilityLabel="Home" style={styles.nav} onPress={() => void reload()}>
        <Ionicons name="home" size={23} color={colors.blue} /><Text style={[styles.navLabel, { color: colors.blue }]}>Home</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: !hasWorkspace }} disabled={!hasWorkspace} style={styles.nav} onPress={() => router.push('/assets')}>
        <Ionicons name="cube-outline" size={23} color={colors.muted} /><Text style={styles.navLabel}>Assets</Text>
      </Pressable>
      <View style={styles.nav} accessibilityLabel="Scan, planned"><Ionicons name="camera-outline" size={23} color="#576575" /><Text style={styles.navLabel}>Scan · Soon</Text></View>
      <View style={styles.nav} accessibilityLabel="Inspections, planned"><Ionicons name="clipboard-outline" size={23} color="#576575" /><Text style={styles.navLabel}>Inspections · Soon</Text></View>
      <Pressable accessibilityRole="button" disabled={signingOut} style={styles.nav} onPress={account}><Ionicons name="person-circle-outline" size={23} color={colors.muted} /><Text style={styles.navLabel}>Account</Text></Pressable>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 18, paddingBottom: 28 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  logo: { color: colors.text, fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: '#334155' },
  avatarText: { color: colors.text, fontWeight: '700', fontSize: 16 },
  greeting: { color: colors.muted, fontSize: 17 },
  name: { color: colors.text, fontSize: 32, fontWeight: '900' },
  company: { color: colors.muted, fontSize: 17, marginTop: 4 },
  scanCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#152234', borderRadius: 18, padding: 18, marginVertical: 18 },
  planned: { color: colors.muted, fontSize: 13 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 28 },
  metric: { width: '48%', minHeight: 122, padding: 16, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16 },
  metricLabel: { color: colors.muted, fontSize: 13, marginTop: 10 },
  metricValue: { color: colors.text, fontSize: 22, fontWeight: '800', marginTop: 4 },
  sectionTitle: { color: colors.text, fontSize: 21, fontWeight: '800', marginBottom: 14 },
  activity: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginBottom: 10, borderRadius: 16, backgroundColor: colors.card },
  activityIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#1D2936' },
  activityText: { color: colors.muted, fontSize: 14 },
  activityDate: { color: '#8B97A8', fontSize: 12, marginTop: 6 },
  bottomNav: { flexDirection: 'row', borderTopWidth: 1, borderColor: colors.border, backgroundColor: '#0B1118', paddingVertical: 12 },
  nav: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  navLabel: { color: colors.muted, fontSize: 10, textAlign: 'center', marginTop: 4 },
});
