'use client';

import { useSession } from 'next-auth/react';

export function useApi() {
    const { data: session } = useSession();

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        if (!session?.accessToken) {
            throw new Error('No access token found. User might not be authenticated.');
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}${url}`, {
            ...options,
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`,
            },
        });

        if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}`);
        }
        return res.json();
    };
    return { fetchWithAuth };
}
