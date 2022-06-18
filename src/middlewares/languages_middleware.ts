import { body, param } from 'express-validator'
import { validate } from './middleware'

export default {
    count: [param('name').optional().isString(), validate],

    index: [
        param('offset').optional().isInt(),
        param('limit').optional().isInt(),
        param('q').optional().isString(),
        validate,
    ],

    findById: [param('id').isUUID(), validate],

    create: [
        body('name').isString().isLength({ min: 3 }),
        body('code').isString().isLength({ min: 3, max: 3 }),
        validate,
    ],

    update: [
        param('id').optional().isUUID(),
        body('name').isString().isLength({ min: 3 }),
        body('code').isString().isLength({ min: 3, max: 3 }),
        validate,
    ],

    delete: [param('id').isUUID(), validate],
}
