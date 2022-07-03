export type SearchInterface = {
    limit?: number
    offset?: number
    query?: string
}

export type CountInterface = {
    name: string | undefined
}

export const toFulltextQuery = (value: string) =>
    value
        .split(' ')
        .map((e) => `*${e}*`)
        .join(' ')
