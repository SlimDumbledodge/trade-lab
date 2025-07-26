import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { actifs } from '../src/utils/seed-actifs';

const prisma = new PrismaClient();

async function main() {
    console.log('🟢 Insertion des actifs de départ...');
    for (const actif of actifs) {
        await prisma.actif.upsert({
            where: { symbol: actif.symbol },
            update: {},
            create: {
                symbol: actif.symbol,
                name: actif.name,
                price: 0,
            },
        });
        console.log(`✅ ${actif.symbol} inséré`);
    }

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
