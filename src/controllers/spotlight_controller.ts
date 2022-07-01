import { Request, Response } from 'express'
import spotlightService from '../services/spotlight_service'
import { ServiceResponse } from './controller'

export default {
    async search(req: Request, res: Response) {
        const search = (req.query.search as string).toLowerCase()
        const response = await spotlightService.search(search)
        return ServiceResponse(res, response)
    },
}
