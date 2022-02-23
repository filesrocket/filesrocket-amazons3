import { Paginated, Query, ResultEntity } from '@filesrocket/filesrocket'
import { createReadStream } from 'fs'
import { parse } from 'path'

import { environments } from '../config/environments'
import { AmazonS3Service } from '../../src/index'

const service = new AmazonS3Service(environments.s3)

export async function uploadFile (
  path: string,
  query: Query = {}
): Promise<Partial<ResultEntity>> {
  const { base: name } = parse(path)

  return service.file.create({
    name,
    stream: createReadStream(path),
    fieldname: 'files',
    encoding: '',
    mimetype: ''
  }, query)
}

export async function uploadManyFiles (
  paths: string[],
  query: Query = {}
): Promise<Partial<ResultEntity>[]> {
  return Promise.all(paths.map(path => uploadFile(path, query)))
}

export async function getFiles (
  query: Query = {}
): Promise<Paginated<ResultEntity>> {
  return service.file.list(query)
}

export async function deleteOneFile (
  key: string
): Promise<ResultEntity> {
  return service.file.remove(key)
}

export async function deleteManyFiles (
  keys: string[]
): Promise<ResultEntity[]> {
  return Promise.all(keys.map(key => deleteOneFile(key)))
}
