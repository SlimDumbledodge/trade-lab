import { useState, useEffect } from 'react';

type FetchOptions = RequestInit & {
    url: string;
    token?: string;
};

export function useFetch<T>({ url, token, ...options }: FetchOptions) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!url) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        ...(options.headers || {}),
                    },
                });
                if (res.status === 401) {
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    return;
                }

                if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

                const json = await res.json();
                setData(json.data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, token]);

    return { data, loading, error };
}
