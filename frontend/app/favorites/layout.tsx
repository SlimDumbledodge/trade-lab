import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Favoris",
    description: "Retrouvez vos actions favorites sur Tradelab Studio.",
    robots: { index: false, follow: false },
}

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
    return children
}
