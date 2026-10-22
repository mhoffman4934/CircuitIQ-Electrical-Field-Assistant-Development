import { auth } from './firebase';

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');
  if (!baseUrl) throw new Error('The API address is not configured. Set EXPO_PUBLIC_API_URL and restart Expo.');
  const user = auth.currentUser;
  if (!user) throw new Error('Please sign in again.');

  const controller = new AbortController();
  const abort = () => controller.abort();
  options.signal?.addEventListener('abort', abort);
  if (options.signal?.aborted) controller.abort();
  const timeout = setTimeout(abort, 15000);
  try {
    const token = await user.getIdToken();
    if (controller.signal.aborted) throw new Error('Request cancelled.');
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    if (options.body) headers.set('Content-Type', 'application/json');
    const response = await fetch(`${baseUrl}${path}`, { ...options, headers, signal: controller.signal });
    const payload = await response.json().catch(() => null);
    if (auth.currentUser?.uid !== user.uid) throw new Error('Your account changed. Please reload.');
    if (!response.ok) {
      if (response.status === 401) throw new Error('Your session could not be verified. Sign out and sign in again.');
      if (response.status >= 500) throw new Error('The server is unavailable. Please try again.');
      const message = payload?.message;
      throw new Error(Array.isArray(message) ? message.join('\n') : message || 'The request could not be completed.');
    }
    if (!payload) throw new Error('The server returned an invalid response. Check the API address.');
    return payload as T;
  } catch (error) {
    if (controller.signal.aborted && !options.signal?.aborted) {
      throw new Error('The request timed out. Check your connection and refresh before submitting again.');
    }
    if (error instanceof TypeError) throw new Error('Cannot reach the server. Check your connection and API address.');
    throw error;
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abort);
  }
}
