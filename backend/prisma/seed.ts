import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    await prisma.actif.createMany({
        data: [
            { name: 'Bitcoin', symbol: 'BTC', price: 60000 },
            { name: 'Ethereum', symbol: 'ETH', price: 3200 },
            { name: 'Solana', symbol: 'SOL', price: 150 },
            { name: 'Ripple', symbol: 'XRP', price: 0.75 },
        ],
    });
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
