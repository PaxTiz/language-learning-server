import { Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'
import languagesService from '../services/languages_service'
import FormError from '../utils/form_error'
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
        if (!req.files) return
        return languagesService
            .create({
                name: req.body.name,
                code: req.body.code,
                flag: req.files.flag as UploadedFile,
            })
            .then((language) => ServiceResponse(res, language, 201))
    },

    async update(req: Request, res: Response) {
        const id = req.params.id
        return languagesService
            .update(id, {
                name: req.body.name,
                code: req.body.code,
                flag: req.files && req.files.flag ? (req.files.flag as UploadedFile) : undefined,
            })
            .then((language) => ServiceResponse(res, language))
    },

    async delete(req: Request, res: Response) {
        const id = req.params.id
        return languagesService.delete(id).then((language) => ServiceResponse(res, language))
    },

    async export(req: Request, res: Response) {
        const format = req.query.format as string
        const all = !!req.query.all
        const languages = req.query.languages as Array<string>

        return languagesService.export(format, all, languages).then((output) => {
            return output instanceof FormError
                ? ServiceResponse(res, output)
                : res.download(output.path, output.filename)
        })
    },
}
