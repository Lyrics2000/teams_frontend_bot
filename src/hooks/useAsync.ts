import { useEffect, useState } from 'react';

export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    loader()
      .then((result) => mounted && setData(result))
      .catch((err) => mounted && setError(err?.message || 'Failed to load data'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
