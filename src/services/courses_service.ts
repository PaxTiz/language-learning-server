import { CourseWithLanguage } from '../client'
import courseRepositoru, { CourseInterface } from '../repositories/courses_repository'
import { CountInterface, SearchInterface } from '../repositories/repository'
import FormError from '../utils/form_error'
import { CoursesExporter } from './export/courses_exporter'
import { Format } from './export/exporter'
import languagesService from './languages_service'

export default {
    async count(params: CountInterface) {
        return courseRepositoru.count(params)
    },

    async index(params: SearchInterface) {
        return courseRepositoru.findAll(params)
    },

    async findById(id: string) {
        return courseRepositoru.findOneBy('id', id)
    },

    async create(course: CourseInterface) {
        const languageExists = await languagesService.findOneBy('code', course.language_id)
        if (languageExists) {
            return new FormError('code', 'code_already_exists')
        }

        return courseRepositoru.create(course)
    },

    async update(id: string, language: CourseInterface) {
        const alreadyExists = await courseRepositoru.findOneBy('id', id)
        if (!alreadyExists) {
            return null
        }

        return courseRepositoru.update(id, language)
    },

    async delete(id: string) {
        const exists = await courseRepositoru.findOneBy('id', id)
        if (!exists) return null

        return courseRepositoru.destroy(id)
    },

    async export(format: string, all: boolean, ids: Array<string> | string) {
        if (!all && !ids) {
            return new FormError('ids', 'missing_ids')
        }

        const courses: Array<CourseWithLanguage> = all
            ? await courseRepositoru.findAll()
            : await courseRepositoru.findAllByIds(parseIds(ids))

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
