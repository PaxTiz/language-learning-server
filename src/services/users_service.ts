import prisma from '../client'
import { SearchInterface } from '../repositories/repository'
import roleService from '../services/roles_service'

export type UserInterface = {
    username: string
    password: string
    email: string
}

export default {
    async exists(column: string, value: unknown) {
        const count = await prisma.user.count({
            where: { [column]: value },
        })
        return count > 0
    },

    async findOneBy(column: string, value: unknown) {
        return await prisma.user.findFirst({
            where: { [column]: value },
            include: { role: true },
        })
    },

    async findAll(params: SearchInterface = {}) {
        return prisma.user.findMany({
            skip: params.offset,
            take: params.limit,
            where: {
                OR: [
                    { email: { contains: params.query } },
                    { username: { contains: params.query } },
                ],
            },
        })
    },

    async create(user: UserInterface) {
        const role = await roleService.findByName('default')
        return await prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: user.password,
                roleId: role.id,
            },
            include: { role: true },
        })
    },
}
