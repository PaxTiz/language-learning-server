import { query } from 'express-validator'
import { validate } from './middleware'

export default {
    search: [query('search').isString(), validate],
}
