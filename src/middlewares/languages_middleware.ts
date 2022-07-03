import { body, param, query } from 'express-validator'
import { applyCommonFilters, file, fileUpload, isAuth, validate } from './middleware'

export default {
    count: [isAuth, param('name').optional().isString(), validate],

    index: [isAuth, ...applyCommonFilters, validate],

    findById: [isAuth, param('id').isUUID(), validate],

    create: [
        // isAuth,
        fileUpload(),
        body('name').isString().isLength({ min: 3 }),
        body('code').isString().isLength({ min: 3, max: 3 }),
        file({ name: 'flag', extensions: ['jpg', 'jpeg', 'png', 'webp'] }),
        validate,
    ],

    update: [
        // isAuth,
        fileUpload(),
        param('id').optional().isUUID(),
        body('name').isString().isLength({ min: 3 }),
        body('code').isString().isLength({ min: 3, max: 3 }),
        file({ name: 'flag', extensions: ['jpg', 'jpeg', 'png', 'webp'], required: false }),
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
