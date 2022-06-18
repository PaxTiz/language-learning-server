import { languages } from '@prisma/client'
import excel from 'exceljs'
import { writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

export default {
    async exportJSON(languages: Array<languages>): Promise<{ path: string; filename: string }> {
        const date = new Date().getTime()
        const json = JSON.stringify(languages)
        const filename = `${date}-export-languages.json`
        const path = join(tmpdir(), filename)
        await writeFile(path, json)
        return { path, filename }
    },

    async exportExcel(
        format: string,
        languages: Array<languages>,
    ): Promise<{ path: string; filename: string }> {
        const date = new Date().getTime()
        const filename = `${date}.csv`
        const path = join(tmpdir(), filename)

        const workbook = new excel.Workbook()
        const sheet = workbook.addWorksheet()
        sheet.columns = [
            { header: 'ID', key: 'id' },
            { header: 'name', key: 'name' },
            { header: 'code', key: 'code' },
        ]
        sheet.addRows(languages)
        if (format === 'csv') {
            await workbook.csv.writeFile(path)
        } else if (format === 'excel') {
            await workbook.xlsx.writeFile(path)
        }

        return { path, filename }
    },
}
