import {
  ServiceMethods,
  Paginated,
  InputEntity,
  OutputEntity,
  Query
} from 'filesrocket'
import { NotFound } from 'filesrocket/lib/errors'
import { omitProps } from 'filesrocket/lib/utils'
import { ManagedUpload } from 'aws-sdk/clients/s3'

import { AmazonConfig } from '../declarations'
import { BaseAmazonRocket } from '../base'

export class FileService extends BaseAmazonRocket implements ServiceMethods {
  constructor (options: AmazonConfig) {
    super(options)
    this.createBucket(options.Bucket)
      .then(() => console.log('Your bucket was create successfully.'))
      .catch(() => console.error('Your bucket already exist.'))
  }

  async create (data: InputEntity, query: Query = {}): Promise<OutputEntity> {
    return new Promise((resolve, reject) => {
      const partialQuery = omitProps(query, ['path'])

      const callback = (err: any, file: ManagedUpload.SendData) => {
        if (err) return reject(err)
        const { Bucket, Key } = file
        const entity = this.builder(file, { Bucket, Key })
        resolve(entity)
      }

      this.s3.upload(
        {
          ...partialQuery,
          Bucket: query.Bucket || this.options.Bucket,
          Key: query.path ? `${query.path}/${data.name}` : data.name,
          Body: data.stream
        },
        callback
      )
    })
  }

  async list (query: Query = {}): Promise<Paginated<OutputEntity>> {
    const partialQuery = omitProps(query, ['path', 'size', 'page', 'prevPage'])
    const { Pagination } = this.options

    const paginate: number =
      query.size <= Pagination.max
        ? query.size
        : Pagination.default

    const Bucket = query.Bucket || this.options.Bucket

    const data = await this.s3
      .listObjectsV2({
        ...partialQuery,
        Bucket,
        MaxKeys: paginate,
        Prefix: query.path,
        ContinuationToken: query.page
      })
      .promise()

    data.Contents = data.Contents?.map((item) => {
      const Bucket = query.Bucket || this.options.Bucket
      const Key = item.Key
      return this.builder(item, { Bucket, Key }) as any
    })

    return this.paginate(data)
  }

  async remove (id: string, query: Query = {}): Promise<OutputEntity> {
    const data = await this.list({ path: id })

    if (!data.items.length) {
      throw new NotFound('File does not exist')
    }

    const Bucket = query.Bucket || this.options.Bucket
    const file = data.items[0]

    await this.s3.deleteObject({ ...query, Bucket, Key: id }).promise()

    return file
  }
}
