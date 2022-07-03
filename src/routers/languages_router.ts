import { Express, Router } from 'express'
import controller from '../controllers/languages_controller'
import middleware from '../middlewares/languages_middleware'

module.exports = (app: Express) => {
    const router = Router()
    app.use('/languages', router)

    router.get('/', middleware.index, controller.index)
    router.get('/count', middleware.count, controller.count)
    router.get('/export', middleware.export, controller.export)
    router.get('/:id/flag', middleware.flag, controller.flag)
    router.get('/:id', middleware.findById, controller.findById)

    router.post('/', middleware.create, controller.create)

    router.patch('/:id', middleware.update, controller.update)

    router.delete('/:id', middleware.delete, controller.delete)
}
