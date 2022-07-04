import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: process.env.APP_ENV !== 'production' ? ['query', 'info', 'warn', 'error'] : [],
})

export type UserWithRole = Prisma.userGetPayload<{
    include: { role: true }
}>

export type CourseWithLanguage = Prisma.coursesGetPayload<{
    include: { language: true }
}>

export default prisma
