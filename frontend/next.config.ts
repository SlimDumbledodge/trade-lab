import type { NextConfig } from "next"

const securityHeaders = [
    {
        key: "X-DNS-Prefetch-Control",
        value: "on",
    },
    {
        key: "X-Content-Type-Options",
        value: "nosniff",
    },
    {
        key: "Referrer-Policy",
        value: "origin-when-cross-origin",
    },
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
    },
]

const nextConfig: NextConfig = {
    output: "standalone",
    compress: true,
    poweredByHeader: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "static2.finnhub.io",
                pathname: "/file/publicdatany/finnhubimage/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3001",
                pathname: "/uploads/**",
            },
            {
                protocol: "https",
                hostname: "api.tradelab-studio.fr",
                pathname: "/uploads/**",
            },
        ],
        formats: ["image/avif", "image/webp"],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: securityHeaders,
            },
        ]
    },
}

export default nextConfig
