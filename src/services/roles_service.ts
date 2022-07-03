import prisma from '../client'

export default {
    async findByName(name: string) {
        return prisma.role.findFirstOrThrow({
            where: { name },
        })
    },
}
