import { param } from 'express-validator'
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
}
