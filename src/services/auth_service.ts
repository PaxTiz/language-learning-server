import Utils from '../utils/crypto'
import FormError from '../utils/form_error'
import userService from './users_service'

export default {
    async login(email: string, password: string) {
        const user = await userService.findOneBy('email', email)
        if (!user) {
            return new FormError('email', 'email_not_found')
        }

        const isValidPassword = await Utils.validateBcrypt(password, user.password)
        if (!isValidPassword) {
            return new FormError('password', 'password_not_match')
        }

        return {
            user: userService.safeUser(user),
            token: Utils.generateJWT({ id: user.id }),
        }
    },

    async create(username: string, password: string, email: string) {
        const errors = []
        const usernameExists = await userService.exists('username', username)
        if (usernameExists) {
            errors.push(new FormError('username', 'username_already_in_use'))
        }

        const emailExists = await userService.exists('email', email)
        if (emailExists) {
            errors.push(new FormError('email', 'email_already_in_use'))
        }

        if (errors.length > 0) {
            return errors
        }

        const user = { username, email, password: await Utils.bcrypt(password) }

        return userService.create(user).then((inserted) => ({
            user: userService.safeUser(inserted),
            token: Utils.generateJWT({ id: inserted.id }),
        }))
    },
}
