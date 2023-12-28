import { readFileSync, readdirSync, writeFile, stat } from 'fs'
import convert from 'heic-convert'
import path from 'path'
import { promisify } from 'util'

export default class ConvertService {
  detectedFiles: number
  convertedFiles: number
  errorConversion: number
  outputDir: string
  inputDir: string

  constructor() {
    this.detectedFiles = 0
    this.convertedFiles = 0
    this.errorConversion = 0
    this.outputDir = ''
    this.inputDir = ''
  }

  async processFile(filePath: string): Promise<void> {
    const fileBuffer = readFileSync(filePath)
    const image = await convert({ buffer: fileBuffer, format: 'JPEG' })

    const inputPathFile = path.join(this.inputDir, `${path.basename(filePath, '.heic')}.jpeg`)

    const write = promisify(writeFile)

    // eslint-disable-next-line
    await write(inputPathFile, image as any)
  }

  countFiles(content: string[]): void {
    let count = 0
    const extension = '.heic'

    for (const file of content) {
      if (file.toLocaleLowerCase().endsWith(extension)) {
        count++
      }
    }

    this.detectedFiles = count
  }

  async convertAllFiles(): Promise<void> {
    const statFile = promisify(stat)
    try {
      const files = readdirSync(this.outputDir)
      this.countFiles(files)

      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(this.outputDir, file)

          const fileStats = await statFile(filePath)

          if (fileStats.isFile() && path.extname(filePath) === '.heic') {
            await this.processFile(filePath)
            this.convertedFiles++
          }
        })
      )
    } catch (err) {
      console.log(err)
      this.errorConversion++
    }
  }
}
