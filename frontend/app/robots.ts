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
                    "/forgot-password/",
                    "/reset-password/",
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
