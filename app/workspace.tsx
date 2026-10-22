import { useState } from 'react';
import { router } from 'expo-router';
import { Text } from 'react-native';
import { Screen, Field, Action, ui } from '../components/Screen';
import { apiRequest } from '../lib/api';

export default function WorkspaceScreen() {
  const [name, setName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (saving || !name.trim() || !siteName.trim()) return;
    setSaving(true); setError(null);
    try {
      await apiRequest('/workspace', { method: 'POST', body: JSON.stringify({ name, siteName }) });
      router.replace('/dashboard');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Unable to create workspace.');
    } finally { setSaving(false); }
  }

  return <Screen title="Set up your workspace">
    <Text style={ui.body}>Add your organization and first site to start recording equipment.</Text>
    <Field label="Organization name" value={name} onChangeText={setName} maxLength={120} editable={!saving} />
    <Field label="First site name" value={siteName} onChangeText={setSiteName} maxLength={120} editable={!saving} />
    {error && <Text accessibilityRole="alert" style={ui.error}>{error}</Text>}
    <Action label={saving ? 'Creating…' : 'Create workspace'} disabled={saving || !name.trim() || !siteName.trim()} onPress={() => void save()} />
  </Screen>;
}
