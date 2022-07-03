export type SearchInterface = {
    limit?: number
    offset?: number
    query?: string
}

export type CountInterface = {
    name: string | undefined
}

export type FindOneInterface = {
    property: string
    value: unknown
}

export type FindOneExceptInterface = {
    find: FindOneInterface
    except: FindOneInterface
}

export const toFulltextQuery = (value: string) =>
    value
        .split(' ')
        .map((e) => `*${e}*`)
        .join(' ')
