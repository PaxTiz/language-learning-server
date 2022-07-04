export const capitalize = (value: string): string => {
    return value
        .split(' ')
        .map((e) => e[0].toUpperCase() + e.slice(1))
        .join(' ')
}

export const parseIds = (ids: Array<string> | string): Array<string> => {
    let items = ids
    if (typeof ids === 'string') {
        items = ids.split(',')
    }
    return Array.from(new Set(items))
}
