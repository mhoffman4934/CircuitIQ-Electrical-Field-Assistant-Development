import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { Screen, LoadState, ui } from '../../components/Screen';
import { useApiResource } from '../../hooks/useApiResource';
import type { Asset } from '../../types/api';

export default function AssetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, error, loading, reload } = useApiResource<Asset>(`/assets/${encodeURIComponent(id ?? '')}`);
  return <Screen title="Asset details">
    <LoadState loading={loading} error={error} retry={() => void reload()} />
    {!loading && data && <>
      <Text style={ui.link}>{data.assetTag}</Text><Text style={ui.title}>{data.name}</Text>
      {[
        ['Site', data.site.name], ['Manufacturer', data.manufacturer], ['Model', data.model],
        ['Serial number', data.serialNumber], ['Last Inspection Date', null], ['Notes', data.notes],
        ['Added', new Date(data.createdAt).toLocaleDateString()],
      ].map(([label, value]) => <View key={label} style={ui.card}><Text style={ui.label}>{label}</Text>
        <Text selectable style={ui.body}>{value || 'Not recorded'}</Text></View>)}
    </>}
  </Screen>;
}
