import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Tradelab Studio — Simulateur de trading",
        short_name: "Tradelab",
        description: "Simulez vos investissements boursiers avec des données réelles. Apprenez le trading sans risque.",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#7c3aed",
        orientation: "portrait-primary",
        categories: ["finance", "education"],
        lang: "fr",
        icons: [
            {
                src: "/icon.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icon.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    }
}
