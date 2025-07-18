import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

async function main() {
    const user1 = await prisma.user.upsert({
        where: { username: 'SlimDumbledodge' },
        update: {},
        create: {
            username: 'SlimDumbledodge',
            email: 'amael.rosales@gmail.com',
            password_hash: 'password',
        },
    })
    console.log({ user1 })
}

main()
    .catch((e) => {
        console.log(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })