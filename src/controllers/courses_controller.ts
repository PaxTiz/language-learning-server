import { Request, Response } from 'express'
import coursesService, { CourseInterface } from '../services/courses_service'
import FormError from '../utils/form_error'
import { ServiceResponse } from './controller'

export default {
    async count(req: Request, res: Response) {
        const query = {
            name: (req.query.name as string) || undefined,
        }
        const response = await coursesService.count(query)
        return ServiceResponse(res, response)
    },

    async index(req: Request, res: Response) {
        const query = {
            offset: parseInt(req.query.offset as string) || undefined,
            limit: parseInt(req.query.limit as string) || undefined,
            query: (req.query.q as string) || undefined,
        }

        const response = await coursesService.findAll(query)
        return ServiceResponse(res, response)
    },

    async findById(req: Request, res: Response) {
        return coursesService
            .findOneBy('id', req.params.id)
            .then((language) => ServiceResponse(res, language))
    },

    async create(req: Request, res: Response) {
        const body = req.body as CourseInterface
        return coursesService.create(body).then((language) => ServiceResponse(res, language, 201))
    },

    async update(req: Request, res: Response) {
        const body = req.body as CourseInterface
        const id = req.params.id
        return coursesService.update(id, body).then((language) => ServiceResponse(res, language))
    },

    async delete(req: Request, res: Response) {
        const id = req.params.id
        return coursesService.delete(id).then((language) => ServiceResponse(res, language))
    },

    async export(req: Request, res: Response) {
        const format = req.query.format as string
        const all = !!req.query.all
        const languages = req.query.languages as Array<string>

        return coursesService.export(format, all, languages).then((output) => {
            return output instanceof FormError
                ? ServiceResponse(res, output)
                : res.download(output.path, output.filename)
        })
    },
}
