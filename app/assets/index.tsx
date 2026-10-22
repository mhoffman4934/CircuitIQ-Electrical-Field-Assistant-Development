import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Screen, Field, Action, LoadState, ui } from '../../components/Screen';
import { useApiResource } from '../../hooks/useApiResource';
import type { AssetPage } from '../../types/api';

export default function AssetsScreen() {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useApiResource<AssetPage>(`/assets?page=${page}&search=${encodeURIComponent(search)}`);
  const submitSearch = () => { setSearch(input.trim()); setPage(1); };

  return <Screen title="Assets">
    <Action label="Add asset" onPress={() => router.push('/assets/new')} />
    <Field label="Search by name or asset tag" value={input} onChangeText={setInput} returnKeyType="search" onSubmitEditing={submitSearch} maxLength={120} />
    <Action label="Search" onPress={submitSearch} />
    <LoadState loading={loading} error={error} retry={() => void reload()} />
    {!loading && data && <>
      <Text style={ui.body}>{data.total} {data.total === 1 ? 'asset' : 'assets'}</Text>
      {data.items.length === 0 && <Text style={ui.body}>{search ? 'No assets match your search.' : 'No assets yet. Add your first equipment record.'}</Text>}
      {data.items.map(asset => <Pressable key={asset.id} accessibilityRole="button" style={ui.card}
        onPress={() => router.push({ pathname: '/assets/[id]', params: { id: asset.id } })}>
        <Text style={ui.link}>{asset.assetTag}</Text><Text style={ui.heading}>{asset.name}</Text>
        <Text style={ui.body}>{asset.site.name}</Text>
      </Pressable>)}
      <View style={ui.row}>
        <Action label="Previous" disabled={page === 1} onPress={() => setPage(value => value - 1)} />
        <Text style={ui.body}>Page {page}</Text>
        <Action label="Next" disabled={page * data.pageSize >= data.total} onPress={() => setPage(value => value + 1)} />
      </View>
    </>}
  </Screen>;
}
