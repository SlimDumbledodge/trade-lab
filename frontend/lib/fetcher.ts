// src/lib/fetcher.ts

export async function fetcher<T>(url: string, token?: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options?.headers,
        },
    })

    if (res.status === 401) {
        console.warn("Unauthorized — redirecting to /login")
        if (typeof window !== "undefined") window.location.href = "/login"
        throw new Error("Unauthorized")
    }

    if (!res.ok) {
        const message = `HTTP ${res.status}: ${res.statusText}`
        throw new Error(message)
    }
    const json = await res.json()
    console.log(json)

    return (json.data ?? json) as T
}
