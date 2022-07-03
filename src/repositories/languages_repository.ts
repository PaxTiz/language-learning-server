import { languages } from '@prisma/client'
import prisma from '../client'

import {
    CountInterface,
    FindOneExceptInterface,
    SearchInterface,
    toFulltextQuery,
} from './repository'

const count = ({ name }: CountInterface): Promise<number> => {
    if (name) {
        name = toFulltextQuery(name)
    }
    return prisma.languages.count({
        where: {
            name: { search: name },
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
    if (query) {
        query = toFulltextQuery(query)
    }
    return prisma.languages.findMany({
        skip: offset,
        take: limit,
        where: {
            name: { search: query },
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

const setFlag = (id: string, flag: string): Promise<languages> => {
    return prisma.languages.update({
        data: { flag },
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
    setFlag,
    destroy,
}
