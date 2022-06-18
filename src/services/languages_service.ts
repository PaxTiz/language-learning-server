import { languages } from '@prisma/client'
import languagesRepository, {
    CountInterface,
    LanguageInterface,
    SearchInterface,
} from '../repositories/languages_repository'
import FormError from '../utils/form_error'
import languageExport from './files/language_export'

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

    async delete(id: string) {
        const exists = await languagesRepository.findOneBy('id', id)
        if (!exists) return null

        return languagesRepository.destroy(id)
    },

    async export(format: string, all: boolean, ids: Array<string> | string) {
        if (!all && !ids) {
            return new FormError('ids', 'missing_ids')
        }

        const languages: Array<languages> = all
            ? await languagesRepository.findAll()
            : await languagesRepository.findAllByIds(parseIds(ids))

        return format === 'json'
            ? languageExport.exportJSON(languages)
            : languageExport.exportExcel(format, languages)
    },
}

const parseIds = (ids: Array<string> | string): Array<string> => {
    let items = ids
    if (typeof ids === 'string') {
        items = ids.split(',')
    }
    return Array.from(new Set(items))
}
