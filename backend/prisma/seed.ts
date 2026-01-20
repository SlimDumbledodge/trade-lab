import "dotenv/config"
import { Asset, PrismaClient } from "../prisma/generated/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
import * as bcrypt from "bcrypt"
import moment from "moment"
import { AlpacaService } from "../src/alpaca/alpaca.service.js"
import { ASSET_PRICE_PERIOD } from "src/assets-price/types/types.js"
import { ConfigService } from "@nestjs/config"

class PrismaServiceMock extends PrismaClient {
    async onModuleInit() {}
    async onModuleDestroy() {
        await this.$disconnect()
    }
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaServiceMock({ adapter })
const configService = new ConfigService()
const alpacaService = new AlpacaService(prisma, configService)

const ASSETS = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corp." },
]

const TIMEFRAMES: {
    label: string
    timeframe: ASSET_PRICE_PERIOD
    subtract: { amount: number; unit: moment.unitOfTime.DurationConstructor }
}[] = [
    { label: "5y", timeframe: ASSET_PRICE_PERIOD.FIVE_YEARS, subtract: { amount: 5, unit: "years" } },
    { label: "1y", timeframe: ASSET_PRICE_PERIOD.ONE_YEAR, subtract: { amount: 1, unit: "year" } },
    { label: "6m", timeframe: ASSET_PRICE_PERIOD.SIX_MONTHS, subtract: { amount: 6, unit: "months" } },
    { label: "1m", timeframe: ASSET_PRICE_PERIOD.ONE_MONTH, subtract: { amount: 1, unit: "month" } },
    { label: "1s", timeframe: ASSET_PRICE_PERIOD.ONE_WEEK, subtract: { amount: 2, unit: "weeks" } },
    { label: "1d", timeframe: ASSET_PRICE_PERIOD.ONE_DAY, subtract: { amount: 5, unit: "days" } },
]

async function seedAssets() {
    const createdAssets: Asset[] = []
    for (const asset of ASSETS) {
        const created = await prisma.asset.upsert({
            where: { symbol: asset.symbol },
            update: {},
            create: { ...asset, lastPrice: 0 },
        })
        createdAssets.push(created)
    }
    console.log(`✅ ${createdAssets.length} assets insérés`)
    return createdAssets
}

async function seedUser() {
    const passwordHash = await bcrypt.hash("admin", 10)
    const user = await prisma.user.upsert({
        where: { email: "amael.rosales@gmail.com" },
        update: {},
        create: {
            username: "Slim",
            email: "amael.rosales@gmail.com",
            passwordHash,
        },
    })

    await prisma.portfolio.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id, cashBalance: 10000 },
    })
    console.log(`✅ Utilisateur ${user.email} créé avec un portefeuille`)
}

async function seedHistoricalPrices(assets: any[]) {
    for (const { label, timeframe, subtract } of TIMEFRAMES) {
        const start = moment()
            .subtract({ [subtract.unit]: subtract.amount })
            .format("YYYY-MM-DD")
        const end = moment().format("YYYY-MM-DD")

        console.log(`📈 [${timeframe}] Récupération ${label} : ${start} → ${end}`)

        const symbols = assets.map((a) => a.symbol)
        // Appelle le service Alpaca (il écrit lui-même en base)
        await alpacaService.getHistoricalBars({
            symbols,
            timeframe,
            start,
            end,
        })

        console.log(`💾 Données ${label} insérées via AlpacaService`)
    }
}

async function main() {
    const assets = await seedAssets()
    await seedUser()
    await seedHistoricalPrices(assets)
}

main()
    .catch((e) => {
        console.error("Erreur lors du seed :", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
