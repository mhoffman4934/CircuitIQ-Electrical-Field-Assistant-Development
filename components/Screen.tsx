import type { ReactNode } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export const colors = { background: '#080D12', card: '#111922', border: '#263544', text: '#FFFFFF', muted: '#AFB9C5', blue: '#278CFF', error: '#FFABA8' };

export function Screen({ title, children }: { title: string; children: ReactNode }) {
  return <SafeAreaView style={ui.screen}>
    <StatusBar style="light" />
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={ui.content} keyboardShouldPersistTaps="handled">
        <Pressable accessibilityRole="button" onPress={() => router.canGoBack() ? router.back() : router.replace('/dashboard')} style={ui.back}>
          <Text style={ui.link}>‹ Back</Text>
        </Pressable>
        <Text style={ui.title}>{title}</Text>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

export function Action({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [ui.button, (disabled || pressed) && { opacity: 0.5 }]}>
    <Text style={ui.buttonText}>{label}</Text>
  </Pressable>;
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return <View style={{ marginBottom: 16 }}><Text style={ui.label}>{label}</Text>
    <TextInput accessibilityLabel={label} placeholderTextColor="#7E8B99" style={ui.input} {...props} />
  </View>;
}

export function LoadState({ loading, error, retry }: { loading: boolean; error: string | null; retry: () => void }) {
  if (loading) return <ActivityIndicator accessibilityLabel="Loading" color={colors.blue} style={{ margin: 24 }} />;
  if (error) return <View style={ui.card}><Text accessibilityRole="alert" style={ui.error}>{error}</Text><Action label="Try again" onPress={retry} /></View>;
  return null;
}

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  back: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: 24 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  body: { color: colors.muted, fontSize: 15, lineHeight: 23, marginBottom: 12 },
  link: { color: colors.blue, fontSize: 16, fontWeight: '600' },
  label: { color: colors.muted, fontSize: 14, marginBottom: 8 },
  input: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, color: colors.text, padding: 14, fontSize: 16, minHeight: 50 },
  button: { backgroundColor: '#1484F6', padding: 16, borderRadius: 12, alignItems: 'center', marginVertical: 8, minHeight: 52 },
  buttonText: { color: colors.text, fontSize: 16, fontWeight: '700' },
  card: { borderRadius: 14, borderColor: colors.border, borderWidth: 1, backgroundColor: colors.card, padding: 18, marginBottom: 12 },
  error: { color: colors.error, fontSize: 15, lineHeight: 23, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
});
