import { languages } from '@prisma/client'
import excel from 'exceljs'
import { writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

export default {
    async exportJSON(languages: Array<languages>): Promise<string> {
        const date = new Date().getTime()
        const json = JSON.stringify(languages)
        const file = join(tmpdir(), `${date}.json`)
        await writeFile(file, json)
        return file
    },

    async exportExcel(format: string, languages: Array<languages>): Promise<string> {
        const date = new Date().getTime()
        const file = join(tmpdir(), `${date}.csv`)

        const workbook = new excel.Workbook()
        const sheet = workbook.addWorksheet()
        sheet.columns = [
            { header: 'ID', key: 'id' },
            { header: 'name', key: 'name' },
            { header: 'code', key: 'code' },
        ]
        sheet.addRows(languages)
        if (format === 'csv') {
            await workbook.csv.writeFile(file)
        } else if (format === 'excel') {
            await workbook.xlsx.writeFile(file)
        }

        return file
    },
}
