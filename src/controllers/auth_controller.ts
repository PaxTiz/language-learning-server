import { Request, Response } from 'express'
import authService from '../services/auth_service'
import userService from '../services/users_service'
import { ServiceResponse } from './controller'

export default {
    async login(req: Request, res: Response) {
        const { email, password } = req.body
        const response = await authService.login(email, password)
        return ServiceResponse(res, response)
    },

    async create(req: Request, res: Response) {
        const { username, password, email } = req.body
        const response = await authService.create(username, password, email)
        return ServiceResponse(res, response, 201)
    },

    async me(req: Request, res: Response) {
        return ServiceResponse(res, userService.safeUser(req.user))
    },
}
