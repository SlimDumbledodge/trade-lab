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
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

export default nextConfig
