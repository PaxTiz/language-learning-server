import { Express, Router } from 'express'
import controller from '../controllers/spotlight_controller'
import middleware from '../middlewares/spotlight_middleware'

module.exports = (app: Express) => {
    const router = Router()
    app.use('/spotlight', router)

    router.get('/', middleware.search, controller.search)
}
