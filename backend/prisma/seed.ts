import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { actifs } from '../src/utils/seed-actifs';

const prisma = new PrismaClient();

async function main() {
    console.log('🟢 FETCH API...');

    console.log('🟢 Insertion des actifs de départ...');
    for (const actif of actifs) {
        await prisma.actif.create({
            data: {
                description: actif.description,
                symbol: actif.symbol,
                type: '',
                current_price: 0,
                highest_price_day: 0,
                lowest_price_day: 0,
                opening_price_day: 0,
                previous_close_price_day: 0,
                percent_change: 0,
                change: 0,
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
