import { languages } from '@prisma/client'
import prisma from '../client'
import { CountInterface, FindOneExceptInterface, SearchInterface } from './repository'

export type LanguageInterface = {
    name: string
    code: string
}

const count = ({ name }: CountInterface): Promise<number> => {
    return prisma.languages.count({
        where: {
            name: {
                contains: name,
            },
        },
    })
}

const findOneBy = (property: string, value: unknown): Promise<languages | null> => {
    return prisma.languages.findFirst({
        where: {
            [property]: value,
        },
    })
}

const findOneByExcept = (condition: FindOneExceptInterface): Promise<languages | null> => {
    return prisma.languages.findFirst({
        where: {
            [condition.find.property]: condition.find.value,
            NOT: {
                [condition.except.property]: {
                    in: condition.except.value,
                },
            },
        },
    })
}

const findAll = (
    { limit, offset, query }: SearchInterface = {
        limit: undefined,
        offset: undefined,
        query: undefined,
    },
): Promise<Array<languages>> => {
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

const findAllByIds = (ids: Array<string>): Promise<Array<languages>> => {
    return prisma.languages.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    })
}

const create = (language: LanguageInterface): Promise<languages> => {
    return prisma.languages.create({
        data: language,
        select: {
            id: true,
            name: true,
            code: true,
        },
    })
}

const update = (id: string, language: LanguageInterface): Promise<languages> => {
    return prisma.languages.update({
        data: language,
        where: { id },
    })
}

const destroy = (id: string) => {
    return prisma.languages.delete({
        where: { id },
    })
}

export default {
    count,
    findAll,
    findAllByIds,
    findOneBy,
    findOneByExcept,
    create,
    update,
    destroy,
}
