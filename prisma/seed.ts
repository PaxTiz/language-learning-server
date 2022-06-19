import { PrismaClient } from '.prisma/client'
import { faker } from '@faker-js/faker'
import Logger from '../src/utils/logger'

const client = new PrismaClient()

const truncate = async () => {
    Logger.info('Delete users')
    await client.user.deleteMany()

    Logger.info('Delete roles')
    await client.role.deleteMany()

    Logger.info('Delete courses')
    await client.courses.deleteMany()

    Logger.info('Delete languages')
    await client.languages.deleteMany()
}

const seed = async () => {
    return await truncate().then(async () => {
        Logger.info('Create roles')
        await client.role.create({
            data: {
                name: 'default',
                displayName: 'Member',
            },
        })

        const languages = []
        for (let _i = 0; _i < 10000; _i++) {
            languages.push({
                name: faker.random.word(),
                code: faker.random.alpha(3).toUpperCase(),
            })
        }

        await client.languages.createMany({
            data: languages,
            skipDuplicates: true,
        })
    })
}

const main = async () => {
    Logger.info('Start seeding')
    return seed().catch((e: Error) => e)
}

main()
    .then(() => {
        Logger.info('Database seeded successfully')
    })
    .catch((e) => {
        Logger.error('Failed to seed database because :')
        Logger.error(e)
    })
    .finally(() => {
        Logger.info('End seeding')
        client.$disconnect()
    })
