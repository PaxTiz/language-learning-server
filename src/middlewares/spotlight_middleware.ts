import { query } from 'express-validator'
import { isAuth, validate } from './middleware'

export default {
    search: [isAuth, query('search').isString(), validate],
}
