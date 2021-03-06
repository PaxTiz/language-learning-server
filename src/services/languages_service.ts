import { languages } from '@prisma/client'
import { UploadedFile } from 'express-fileupload'
import prisma from '../client'
import { Format } from '../lib/export/exporter'
import { LanguagesExporter } from '../lib/export/languages_exporter'
import { absolutePath, uploadImage } from '../lib/file_uploader'
import FormError from '../utils/form_error'
import { parseIds } from '../utils/string'
import { CountInterface, SearchInterface, toFulltextQuery } from './service'

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
        if (params.name) {
            params.name = toFulltextQuery(params.name)
        }
        return prisma.languages.count({
            where: {
                name: { search: params.name },
            },
        })
    },

    async findAll(params: SearchInterface = {}) {
        if (params.query) {
            params.query = toFulltextQuery(params.query)
        }
        return prisma.languages.findMany({
            skip: params.offset,
            take: params.limit,
            where: {
                name: { search: params.query },
            },
        })
    },

    async findOneBy(property: string, value: unknown) {
        return prisma.languages.findFirst({ where: { [property]: value } })
    },

    async findAllBy(property: string, values: Array<unknown>) {
        return prisma.languages.findMany({
            where: { [property]: { in: values } },
        })
    },

    async getFlag(id: string) {
        const language = await this.findOneBy('id', id)
        if (!language) {
            return null
        }

        return absolutePath(language.flag)
    },

    async create(language: LanguageCreate) {
        return prisma.$transaction(async (prisma) => {
            const codeExists = await this.findOneBy('code', language.code)
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
            const alreadyExists = await this.findOneBy('id', id)
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

    async delete(ids: Array<string>) {
        if (!ids) {
            return new FormError('ids', 'missing_ids')
        }

        ids = parseIds(ids)
        return prisma.languages.deleteMany({
            where: { id: { in: ids } },
        })
    },

    async export(format: string, all: boolean, ids: Array<string> | string) {
        if (!all && !ids) {
            return new FormError('ids', 'missing_ids')
        }

        const languages: Array<languages> = all
            ? await this.findAll()
            : await this.findAllBy('id', parseIds(ids))

        return new LanguagesExporter(format as Format, languages).export()
    },
}
