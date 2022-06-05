import { Express, Router } from 'express'
import controller from '../controllers/languages_controller'
import middleware from '../middlewares/languages_middleware'

module.exports = (app: Express) => {
    const router = Router()
    app.use('/languages', router)

    router.get('/', middleware.index, controller.index)
    router.get('/count', middleware.count, controller.count)
}
