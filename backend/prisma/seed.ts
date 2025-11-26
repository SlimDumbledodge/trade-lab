import 'dotenv/config'
import { PrismaClient } from '../prisma/generated/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcrypt'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Tes assets
  const assets = [
    { symbol: 'AAPL', name: 'Apple Inc', description: 'Description AAPL', lastPrice: 253.53 },
    { symbol: 'MSFT', name: 'Microsoft Corp', description: 'Description MSFT', lastPrice: 340.12 },
  ];

  for (const asset of assets) {
    await prisma.asset.upsert({
      where: { symbol: asset.symbol },
      update: {},
      create: asset,
    });
    console.log(`✅ ${asset.symbol} inséré`);
  }

  const passwordHash = await bcrypt.hash('admin', 10);

  const user = await prisma.user.upsert({
    where: { email: 'amael.rosales@gmail.com' },
    update: {},
    create: {
      username: 'Slim',
      email: 'amael.rosales@gmail.com',
      passwordHash,
    },
  });

  await prisma.portfolio.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, cashBalance: 10000 },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
