import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static2.finnhub.io',
                pathname: '/file/publicdatany/finnhubimage/**',
            },
        ],
    },
};

export default nextConfig;
