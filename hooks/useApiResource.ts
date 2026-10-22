import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

export function useApiResource<T>(path: string) {
  const { user } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const active = useRef<AbortController | null>(null);

  const reload = useCallback(async () => {
    active.current?.abort();
    const request = new AbortController();
    active.current = request;
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<T>(path, { signal: request.signal });
      if (!request.signal.aborted) setData(result);
    } catch (failure) {
      if (!request.signal.aborted) {
        setData(null);
        setError(failure instanceof Error ? failure.message : 'Unable to load data.');
      }
    } finally {
      if (!request.signal.aborted) setLoading(false);
    }
  }, [path]);

  useFocusEffect(useCallback(() => {
    setData(null);
    void reload();
    return () => { active.current?.abort(); };
  }, [reload, user?.uid]));

  return { data, error, loading, reload };
}
