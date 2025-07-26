import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

    const password = await bcrypt.hash('12345678', 10);

    const user1 = await prisma.user.create({
        data: {
            username: 'Slim',
            email: 'amael.rosales@gmail.com',
            password,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            username: 'SlimDumbledodge',
            email: 'rslamael@gmail.com',
            password,
        },
    });

    await prisma.portfolio.createMany({
        data: [
            { userId: user1.id, balance: 100000 },
            { userId: user2.id, balance: 75000 },
        ],
    });
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
