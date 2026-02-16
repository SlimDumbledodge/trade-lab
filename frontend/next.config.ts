import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    output: "standalone",
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
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

export default nextConfig
