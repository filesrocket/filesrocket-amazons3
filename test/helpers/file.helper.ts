import { Paginated, Query, OutputEntity, InputEntity } from 'filesrocket'
import { createReadStream } from 'fs'
import { parse } from 'path'

import service from '../config/amazon'

export async function uploadFile (
  path: string,
  query: Query = {}
): Promise<Partial<OutputEntity>> {
  const { base: name } = parse(path)

  const data: InputEntity = {
    name,
    stream: createReadStream(path),
    fieldname: 'files',
    encoding: '',
    mimetype: ''
  }

  return service.create(data, query)
}

export async function uploadManyFiles (
  paths: string[],
  query: Query = {}
): Promise<Partial<OutputEntity>[]> {
  return Promise.all(paths.map(path => uploadFile(path, query)))
}

export async function getFiles (
  query: Query = {}
): Promise<Paginated<OutputEntity>> {
  return service.list(query)
}

export async function deleteOneFile (
  key: string
): Promise<OutputEntity> {
  return service.remove(key)
}

export async function deleteManyFiles (
  keys: string[]
): Promise<OutputEntity[]> {
  return Promise.all(keys.map(key => deleteOneFile(key)))
}
