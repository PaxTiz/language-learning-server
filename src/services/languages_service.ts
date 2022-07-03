import { languages } from '@prisma/client'
import { UploadedFile } from 'express-fileupload'
import prisma from '../client'
import { remove, uploadImage } from '../lib/file_uploader'
import languagesRepository from '../repositories/languages_repository'
import { CountInterface, SearchInterface } from '../repositories/repository'
import FormError from '../utils/form_error'
import { Format } from './export/exporter'
import { LanguagesExporter } from './export/languages_exporter'

export type LanguageCreate = {
    name: string
    code: string
    flag: UploadedFile
}

export type LanguageUpdate = {
    name: string
    code: string
    flag?: UploadedFile
}

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

    async create(language: LanguageCreate) {
        return prisma.$transaction(async (prisma) => {
            const codeExists = await prisma.languages.findFirst({ where: { code: language.code } })
            if (codeExists) {
                return new FormError('code', 'code_already_exists')
            }

            const created = await prisma.languages.create({
                data: {
                    name: language.name,
                    code: language.code,
                    flag: '',
                },
            })

            return uploadImage({
                data: language.flag.data,
                name: created.id,
                directory: 'flags',
                format: 'webp',
            }).then((flag) => {
                return prisma.languages.update({
                    data: { flag },
                    where: { id: created.id },
                })
            })
        })
    },

    async update(id: string, language: LanguageUpdate) {
        return prisma.$transaction(async (prisma) => {
            const alreadyExists = await prisma.languages.findFirst({ where: { id } })
            if (!alreadyExists) {
                return null
            }

            const codeExists = await prisma.languages.findFirst({
                where: {
                    code: language.code,
                    id: { not: id },
                },
            })
            if (codeExists) {
                return new FormError('code', 'code_already_exists')
            }

            if (language.flag) {
                await uploadImage({
                    data: language.flag.data,
                    name: alreadyExists.id,
                    format: 'webp',
                    directory: 'flags',
                })
            }

            return prisma.languages.update({
                data: {
                    name: language.name,
                    code: language.code,
                },
                where: { id },
            })
        })
    },

    async delete(id: string) {
        return prisma.$transaction(async (prisma) => {
            const exists = await prisma.languages.findFirst({ where: { id } })
            if (!exists) return null

            return remove(exists.flag)?.then(() => {
                return languagesRepository.destroy(id)
            })
        })
    },

    async export(format: string, all: boolean, ids: Array<string> | string) {
        if (!all && !ids) {
            return new FormError('ids', 'missing_ids')
        }

        const languages: Array<languages> = all
            ? await languagesRepository.findAll()
            : await languagesRepository.findAllByIds(parseIds(ids))

        return new LanguagesExporter(format as Format, languages).export()
    },
}

const parseIds = (ids: Array<string> | string): Array<string> => {
    let items = ids
    if (typeof ids === 'string') {
        items = ids.split(',')
    }
    return Array.from(new Set(items))
}
