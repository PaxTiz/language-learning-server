import { body, param, query } from 'express-validator'
import { applyCommonFilters, isAuth, validate } from './middleware'

export default {
    count: [isAuth, param('name').optional().isString(), validate],

    index: [isAuth, ...applyCommonFilters, validate],

    findById: [isAuth, param('id').isUUID(), validate],

    create: [
        isAuth,
        body('name').isString().isLength({ min: 3 }),
        body('code').isString().isLength({ min: 3, max: 3 }),
        validate,
    ],

    update: [
        isAuth,
        param('id').optional().isUUID(),
        body('name').isString().isLength({ min: 3 }),
        body('code').isString().isLength({ min: 3, max: 3 }),
        validate,
    ],

    delete: [isAuth, param('id').isUUID(), validate],

    export: [
        isAuth,
        query('format').isIn(['json', 'csv', 'excel']),
        query('all').optional().isBoolean().toBoolean(),
        query('languages.*').optional().isUUID(),
        validate,
    ],
}
