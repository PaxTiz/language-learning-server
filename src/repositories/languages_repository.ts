import { languages } from '@prisma/client'
import prisma from '../client'

export type SearchInterface = {
    limit: number | undefined
    offset: number | undefined
    query: string | undefined
}

export type CountInterface = {
    name: string | undefined
}

const count = async ({ name }: CountInterface): Promise<number> => {
    return prisma.languages.count({
        where: {
            name: {
                contains: name,
            },
        },
    })
}

const findOneBy = async (property: string, value: unknown): Promise<languages | null> => {
    return prisma.languages.findFirst({
        where: {
            [property]: value,
        },
    })
}

const findAll = async ({ limit, offset, query }: SearchInterface): Promise<Array<languages>> => {
    return prisma.languages.findMany({
        skip: offset,
        take: limit,
        where: {
            name: {
                contains: query,
            },
        },
    })
}

export default {
    count,
    findAll,
    findOneBy,
}
