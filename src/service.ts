import { FileManager } from 'filesrocket'

import { FileService } from './services/file.service'
import { AmazonConfig } from './declarations'

export class AmazonS3Service implements FileManager {
  file: FileService

  constructor (options: AmazonConfig) {
    this.file = new FileService(options)
  }
}
