// types.ts (dans le front)
export interface Actif {
    id: number;
    description: string;
    symbol: string;
    type: string; // ⚠️ tu peux le remplacer par un union type si tu veux limiter (ex: 'Common Stock' | 'ETP' | 'CRYPTO')
    current_price: number;
    highest_price_day: number;
    lowest_price_day: number;
    opening_price_day: number;
    previous_close_price_day: number;
    percent_change: number;
    change: number;
    createdAt: string; // Date renvoyée en string par l'API
    updatedAt: string; // idem
}
