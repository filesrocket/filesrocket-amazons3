import dotenv from 'dotenv'
dotenv.config()

export const environments = {
  s3: {
    Pagination: { default: 15, max: 35 },
    Bucket: process.env.BUCKET || 'filesrocket-test',
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_API as string,
      secretAccessKey: process.env.SECRET_ACCESS_KEY as string
    }
  }
}
