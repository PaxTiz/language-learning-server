import { body, param, query } from 'express-validator'
import { applyCommonFilters, validate } from './middleware'

export default {
    count: [param('name').optional().isString(), validate],

    index: [...applyCommonFilters, validate],

    findById: [param('id').isUUID(), validate],

    create: [body('name').isString().isLength({ min: 3 }), body('language_id').isUUID(), validate],

    update: [
        param('id').optional().isUUID(),
        body('name').isString().isLength({ min: 3 }),
        body('language_id').isUUID(),
        validate,
    ],

    delete: [param('id').isUUID(), validate],

    export: [
        query('format').isIn(['json', 'csv', 'excel']),
        query('all').optional().isBoolean().toBoolean(),
        query('courses.*').optional().isUUID(),
        validate,
    ],
}
