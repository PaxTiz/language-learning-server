import { languages } from '@prisma/client'
import excel from 'exceljs'
import { writeFile } from 'fs/promises'
import { Exporter } from './exporter'

export class LanguagesExporter extends Exporter<languages> {
    context = 'languages'

    async _buildJson(path: string): Promise<void> {
        const json = JSON.stringify(this.items)
        await writeFile(path, json)
    }

    async _buildExcel(path: string): Promise<void> {
        const workbook = new excel.Workbook()
        const sheet = workbook.addWorksheet()
        sheet.columns = [
            { header: 'ID', key: 'id' },
            { header: 'name', key: 'name' },
            { header: 'code', key: 'code' },
        ]
        sheet.addRows(this.items)
        if (this.format === 'csv') {
            await workbook.csv.writeFile(path)
        } else if (this.format === 'excel') {
            await workbook.xlsx.writeFile(path)
        }
    }
}
