import { existsSync } from 'fs'
import { mkdir, writeFile, rm } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'

const uploadDirectory = join(__dirname, '..', '..', 'upload')

type UploadImageOptions = {
    data: Buffer
    name: string
    directory?: string
    format: 'webp' | 'png'
}

export const uploadImage = async (options: UploadImageOptions) => {
    let uploadedDirectory = uploadDirectory
    if (options.directory) {
        uploadedDirectory = join(
            uploadedDirectory,
            Array.isArray(options.directory) ? join(...options.directory) : options.directory,
        )
    }

    if (!existsSync(uploadedDirectory)) {
        await mkdir(uploadedDirectory, { recursive: true })
    }

    const imageName = `${options.name.toLowerCase()}.${options.format}`
    let image = sharp(options.data)
    switch (options.format) {
        case 'webp':
            image = await image.webp()
            break
        case 'png':
            image = await image.png()
            break
    }

    const imageBuffer = await image.toBuffer()
    const imagePath = join(uploadedDirectory, imageName)
    await writeFile(imagePath, imageBuffer)
    const path = imagePath.split('/upload/')[1]
    return `/upload/${path}`
}

export const remove = (file: string) => {
    const filename = join(__dirname, '..', '..', file)
    if (existsSync(filename)) {
        return rm(filename)
    }
}
