import { Paginated, Query, OutputEntity, InputEntity } from 'filesrocket'
import { createReadStream } from 'fs'
import { parse } from 'path'

import service from '../config/amazon'

export async function uploadOne (
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

export async function uploadMany (
  paths: string[],
  query: Query = {}
): Promise<Partial<OutputEntity>[]> {
  return Promise.all(
    paths.map(path => uploadOne(path, query))
  )
}

export function findOne (id: string): Promise<OutputEntity> {
  return service.get(id)
}

export async function find (
  query: Query = {}
): Promise<Paginated<OutputEntity>> {
  return service.list(query)
}

export async function remove (
  keys: string[]
): Promise<OutputEntity[]> {
  return Promise.all(
    keys.map(key => service.remove(key))
  )
}
