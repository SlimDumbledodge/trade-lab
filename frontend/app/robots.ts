import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://tradelab-studio.fr"

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/account/",
                    "/portfolio/",
                    "/market/",
                    "/transactions/",
                    "/favorites/",
                    "/statistics/",
                    "/orders/",
                    "/alerts/",
                    "/forgot-password/",
                    "/reset-password/",
                ],
            },
            {
                userAgent: "Googlebot",
                allow: "/",
                disallow: [
                    "/api/",
                    "/account/",
                    "/portfolio/",
                    "/market/",
                    "/transactions/",
                    "/favorites/",
                    "/statistics/",
                    "/orders/",
                    "/alerts/",
                    "/forgot-password/",
                    "/reset-password/",
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}
