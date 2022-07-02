import { courses } from '@prisma/client'
import prisma, { CourseWithLanguage } from '../client'
import {
    CountInterface,
    FindOneExceptInterface,
    SearchInterface,
    toFulltextQuery,
} from './repository'

export type CourseInterface = {
    name: string
    language_id: string
}

const count = ({ name }: CountInterface): Promise<number> => {
    if (name) {
        name = toFulltextQuery(name)
    }
    return prisma.courses.count({
        where: {
            name: { search: name },
        },
    })
}

const findOneBy = (property: string, value: unknown): Promise<courses | null> => {
    return prisma.courses.findFirst({
        where: {
            [property]: value,
        },
        include: {
            language: true,
        },
    })
}

const findOneByExcept = (condition: FindOneExceptInterface): Promise<courses | null> => {
    return prisma.courses.findFirst({
        where: {
            [condition.find.property]: condition.find.value,
            NOT: {
                [condition.except.property]: {
                    in: condition.except.value,
                },
            },
        },
        include: {
            language: true,
        },
    })
}

const findAll = (
    { limit, offset, query }: SearchInterface = {
        limit: undefined,
        offset: undefined,
        query: undefined,
    },
): Promise<Array<CourseWithLanguage>> => {
    if (query) {
        query = toFulltextQuery(query)
    }
    return prisma.courses.findMany({
        skip: offset,
        take: limit,
        where: {
            name: { search: query },
        },
        include: {
            language: true,
        },
    })
}

const findAllByIds = (ids: Array<string>): Promise<Array<CourseWithLanguage>> => {
    return prisma.courses.findMany({
        where: {
            id: {
                in: ids,
            },
        },
        include: {
            language: true,
        },
    })
}

const create = (course: CourseInterface): Promise<courses> => {
    return prisma.courses.create({
        data: course,
        select: {
            id: true,
            name: true,
            language: true,
            language_id: true,
        },
    })
}

const update = (id: string, course: CourseInterface): Promise<courses> => {
    return prisma.courses.update({
        data: course,
        where: { id },
    })
}

const destroy = (id: string) => {
    return prisma.courses.delete({
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
