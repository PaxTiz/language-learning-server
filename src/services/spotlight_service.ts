import coursesRepository from '../repositories/courses_repository'
import languagesRepository from '../repositories/languages_repository'
import userRepository from '../repositories/user_repository'
import { capitalize } from '../utils/string'

export enum Category {
    page = 'page',
    course = 'course',
    language = 'language',
    lesson = 'lesson',
    post = 'post',
    user = 'user',
}

const _getPages = (value: string) => {
    return Object.values(Category)
        .filter((e) => e !== 'page' && e.includes(value))
        .map((e) => ({
            title: `${capitalize(e)}s`,
            target: `/${e}s`,
            category: 'page',
            categoryColor: 'green',
        }))
}

const _getLanguages = (value: string, limit = 5) => {
    return languagesRepository.findAll({ limit, offset: 0, query: value }).then((res) =>
        res.map((e) => ({
            title: e.name,
            target: `/languages/${e.id}`,
            category: 'language',
            categoryColor: 'blue',
        })),
    )
}

const _getCourses = (value: string, limit = 5) => {
    return coursesRepository.findAll({ limit, offset: 0, query: value }).then((res) =>
        res.map((e) => ({
            title: e.name,
            target: `/courses/${e.id}`,
            category: 'course',
            categoryColor: 'red',
        })),
    )
}

const _getUsers = (value: string, limit = 5) => {
    return userRepository.findAll({ limit, offset: 0, query: `%${value}%` }).then((res) =>
        res.map((e) => ({
            title: e.email,
            target: `/users/${e.id}`,
            category: 'user',
            categoryColor: 'yellow',
        })),
    )
}

const methods = {
    page: _getPages,
    language: _getLanguages,
    course: _getCourses,
    user: _getUsers,
} as unknown as Record<Category, (value: string, limit: number) => Array<unknown>>

export default {
    async search(value: string) {
        if (value.includes(':')) {
            const points = value.indexOf(':')
            const category = value.substring(0, points) as Category
            if (Object.values(Category).includes(category)) {
                value = value.substring(points + 1)
                return methods[category](value, 50)
            }
        }

        return [
            ..._getPages(value),
            ...(await _getLanguages(value)),
            ...(await _getCourses(value)),
            ...(await _getUsers(value)),
        ]
    },
}
