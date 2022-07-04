import excel from 'exceljs'
import { writeFile } from 'fs/promises'
import { CourseWithLanguage } from '../../client'
import { Exporter } from './exporter'

export class CoursesExporter extends Exporter<CourseWithLanguage> {
    context = 'courses'

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
            { header: 'language', key: 'language' },
        ]
        sheet.addRows(
            this.items.map((e) => ({
                id: e.id,
                name: e.name,
                language: e.language.name,
            })),
        )
        if (this.format === 'csv') {
            await workbook.csv.writeFile(path)
        } else if (this.format === 'excel') {
            await workbook.xlsx.writeFile(path)
        }
    }
}
