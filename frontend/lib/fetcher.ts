import { logger } from "./logger"

export async function fetcher<T>(url: string, token?: string, options?: RequestInit): Promise<T> {
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options?.headers,
            },
        })

        if (res.status === 401) {
            logger.warn("Unauthorized access attempt", { url })
            if (typeof window !== "undefined") {
                window.location.href = "/login"
            }
            throw new Error("Unauthorized")
        }

        if (!res.ok) {
            const message = `HTTP ${res.status}: ${res.statusText}`
            logger.error("API request failed", { url, status: res.status, message })
            throw new Error(message)
        }

        const json = await res.json()
        return (json.data ?? json) as T
    } catch (error) {
        logger.error("Fetcher error", { url, error })
        throw error
    }
}
