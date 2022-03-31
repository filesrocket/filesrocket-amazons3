import dotenv from 'dotenv'

import { AmazonS3FileService } from '../../src/index'

dotenv.config()

export default new AmazonS3FileService({
  Pagination: { default: 15, max: 35 },
  Bucket: process.env.BUCKET || 'filesrocket-test',
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_API as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string
  }
})
