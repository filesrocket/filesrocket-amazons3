import { Paginated, Query, ResultEntity } from 'filesrocket'
import { createReadStream } from 'fs'
import { parse } from 'path'

import { environments } from '../config/environments'
import { S3FileService } from '../../src/index'

const service = new S3FileService(environments.s3)

export async function uploadFile (
  path: string,
  query: Query = {}
): Promise<Partial<ResultEntity>> {
  const { base: name } = parse(path)

  return service.create({
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
  return service.list(query)
}

export async function deleteOneFile (
  key: string
): Promise<ResultEntity> {
  return service.remove(key)
}

export async function deleteManyFiles (
  keys: string[]
): Promise<ResultEntity[]> {
  return Promise.all(keys.map(key => deleteOneFile(key)))
}
