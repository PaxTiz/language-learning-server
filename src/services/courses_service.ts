import prisma, { CourseWithLanguage } from '../client'
import { CoursesExporter } from '../lib/export/courses_exporter'
import { Format } from '../lib/export/exporter'
import FormError from '../utils/form_error'
import languagesService from './languages_service'
import { CountInterface, SearchInterface, toFulltextQuery } from './service'

export type CourseInterface = {
    name: string
    language_id: string
}

export default {
    async count(params: CountInterface) {
        if (params.name) {
            params.name = toFulltextQuery(params.name)
        }
        return prisma.courses.count({
            where: {
                name: { search: params.name },
            },
        })
    },

    async findAll(params: SearchInterface = {}) {
        if (params.query) {
            params.query = toFulltextQuery(params.query)
        }
        return prisma.courses.findMany({
            skip: params.offset,
            take: params.limit,
            include: { language: true },
            where: {
                name: { search: params.query },
            },
        })
    },

    async findOneBy(property: string, value: unknown) {
        return prisma.courses.findFirst({
            where: { [property]: value },
            include: { language: true },
        })
    },

    async findAllBy(property: string, values: Array<unknown>) {
        return prisma.courses.findMany({
            where: { [property]: { in: values } },
            include: { language: true },
        })
    },

    async create(course: CourseInterface) {
        const languageExists = await languagesService.findOneBy('code', course.language_id)
        if (languageExists) {
            return new FormError('code', 'code_already_exists')
        }

        return prisma.courses.create({
            data: course,
            select: {
                id: true,
                name: true,
                language: true,
                language_id: true,
            },
        })
    },

    async update(id: string, course: CourseInterface) {
        const alreadyExists = await this.findOneBy('id', id)
        if (!alreadyExists) {
            return null
        }

        return prisma.courses.update({
            data: course,
            where: { id },
        })
    },

    async delete(id: string) {
        const exists = await this.findOneBy('id', id)
        if (!exists) return null

        return prisma.courses.delete({
            where: { id },
        })
    },

    async export(format: string, all: boolean, ids: Array<string> | string) {
        if (!all && !ids) {
            return new FormError('ids', 'missing_ids')
        }

        const courses: Array<CourseWithLanguage> = all
            ? await this.findAll()
            : await this.findAllBy('id', parseIds(ids))

        return new CoursesExporter(format as Format, courses).export()
    },
}

const parseIds = (ids: Array<string> | string): Array<string> => {
    let items = ids
    if (typeof ids === 'string') {
        items = ids.split(',')
    }
    return Array.from(new Set(items))
}
