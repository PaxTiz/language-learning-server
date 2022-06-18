import { Request, Response } from 'express'
import { LanguageInterface } from '../repositories/languages_repository'
import languagesService from '../services/languages_service'
import { ServiceResponse } from './controller'

export default {
    async count(req: Request, res: Response) {
        const query = {
            name: (req.query.name as string) || undefined,
        }
        const response = await languagesService.count(query)
        return ServiceResponse(res, response)
    },

    async index(req: Request, res: Response) {
        const query = {
            offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
            query: req.query.q ? (req.query.q as string) : undefined,
        }

        const response = await languagesService.index(query)
        return ServiceResponse(res, response)
    },

    async findById(req: Request, res: Response) {
        return languagesService
            .findById(req.params.id)
            .then((language) => ServiceResponse(res, language))
    },

    async create(req: Request, res: Response) {
        const body = req.body as LanguageInterface
        return languagesService.create(body).then((language) => ServiceResponse(res, language, 201))
    },

    async update(req: Request, res: Response) {
        const body = req.body as LanguageInterface
        const id = req.params.id
        return languagesService.update(id, body).then((language) => ServiceResponse(res, language))
    },
}
