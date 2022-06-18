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

export type LanguageInterface = {
    name: string
    code: string
}

type FindOneInterface = {
    property: string
    value: unknown
}

type FindOneExceptInterface = {
    find: FindOneInterface
    except: FindOneInterface
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

const findAll = ({ limit, offset, query }: SearchInterface): Promise<Array<languages>> => {
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

export default {
    count,
    findAll,
    findOneBy,
    findOneByExcept,
    create,
    update,
}
