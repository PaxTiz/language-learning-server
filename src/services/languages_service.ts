import languagesRepository, {
    CountInterface,
    LanguageInterface,
    SearchInterface,
} from '../repositories/languages_repository'
import FormError from '../utils/form_error'

export default {
    async count(params: CountInterface) {
        return languagesRepository.count(params)
    },

    async index(params: SearchInterface) {
        return languagesRepository.findAll(params)
    },

    async findById(id: string) {
        return languagesRepository.findOneBy('id', id)
    },

    async create(language: LanguageInterface) {
        const codeExists = await languagesRepository.findOneBy('code', language.code)
        if (codeExists) {
            return new FormError('code', 'code_already_exists')
        }

        return languagesRepository.create(language)
    },

    async update(id: string, language: LanguageInterface) {
        const alreadyExists = await languagesRepository.findOneBy('id', id)
        if (!alreadyExists) {
            return null
        }

        const codeExists = await languagesRepository.findOneByExcept({
            find: { property: 'code', value: language.code },
            except: { property: 'id', value: id },
        })
        if (codeExists) {
            return new FormError('code', 'code_already_exists')
        }

        return languagesRepository.update(id, language)
    },
}
