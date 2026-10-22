import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { Screen, Field, Action, LoadState, ui } from '../../components/Screen';
import { useApiResource } from '../../hooks/useApiResource';
import { apiRequest } from '../../lib/api';
import type { Asset, Dashboard } from '../../types/api';

const initial = { assetTag: '', name: '', manufacturer: '', model: '', serialNumber: '', notes: '' };
export default function NewAssetScreen() {
  const { data, error, loading, reload } = useApiResource<Dashboard>('/dashboard');
  const [form, setForm] = useState(initial);
  const [selectedSite, setSelectedSite] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const sites = data?.workspace?.sites ?? [];
  const siteId = selectedSite || sites[0]?.id;

  async function save() {
    if (saving || !siteId || !form.name.trim() || !form.assetTag.trim()) return;
    setSaving(true); setSaveError(null);
    try {
      const asset = await apiRequest<Asset>('/assets', { method: 'POST', body: JSON.stringify({ ...form, siteId }) });
      router.replace({ pathname: '/assets/[id]', params: { id: asset.id } });
    } catch (failure) {
      setSaveError(failure instanceof Error ? failure.message : 'Unable to save asset.');
    } finally { setSaving(false); }
  }

  return <Screen title="Add asset">
    <LoadState loading={loading} error={error} retry={() => void reload()} />
    {!loading && data && !data.workspace && <Action label="Set up workspace" onPress={() => router.replace('/workspace')} />}
    {!loading && data?.workspace && <>
      <Text style={ui.label}>Site</Text>
      {sites.map(site => <Pressable key={site.id} disabled={saving} accessibilityRole="radio" accessibilityState={{ selected: siteId === site.id }}
        onPress={() => setSelectedSite(site.id)} style={[ui.card, siteId === site.id && { borderColor: '#278CFF' }]}>
        <Text style={ui.heading}>{site.name}{siteId === site.id ? ' ✓' : ''}</Text>
      </Pressable>)}
      {([
        ['assetTag', 'Asset tag *', 80], ['name', 'Equipment name *', 120],
        ['manufacturer', 'Manufacturer', 120], ['model', 'Model', 120],
        ['serialNumber', 'Serial number', 120], ['notes', 'Notes', 2000],
      ] as const).map(([key, label, length]) => <Field key={key} label={label} value={form[key]} maxLength={length}
        editable={!saving} multiline={key === 'notes'} autoCapitalize={key === 'assetTag' ? 'characters' : 'sentences'}
        onChangeText={value => setForm(current => ({ ...current, [key]: value }))} />)}
      {saveError && <Text accessibilityRole="alert" style={ui.error}>{saveError}</Text>}
      <Action label={saving ? 'Saving…' : 'Save asset'} onPress={() => void save()}
        disabled={saving || !siteId || !form.name.trim() || !form.assetTag.trim()} />
    </>}
  </Screen>;
}
