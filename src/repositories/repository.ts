export type SearchInterface = {
    limit: number | undefined
    offset: number | undefined
    query: string | undefined
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
