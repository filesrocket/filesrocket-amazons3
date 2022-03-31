import { Paginated, OutputEntity } from 'filesrocket'
import { resolve } from 'path'

import {
  uploadFile,
  uploadManyFiles,
  getFiles,
  deleteOneFile,
  deleteManyFiles
} from './helpers/file.helper'

jest.mock('filesrocket')

const FILESNAMES: string[] = [
  'one.png',
  'two.png',
  'three.png',
  'four.png',
  'five.png'
]

const DIRECTORY_NAME: string = 'images'

beforeAll(() => {
  jest.setTimeout((60 * 5) * 1000)
})

describe('Uploading files', () => {
  const paths: string[] = FILESNAMES.map(
    (name) => resolve(`test/fixtures/${name}`)
  )

  const name: string = FILESNAMES[0]
  const path: string = `test/fixtures/${name}`

  test('Upload many files', async () => {
    const results = await uploadManyFiles(paths)
    expect(results).toHaveLength(paths.length)
  })

  test('Upload single file', async () => {
    const entity = await uploadFile(path)
    expect(typeof entity).toBe('object')
    expect(entity.name).toBe(name)
  })

  test('Upload many files in a directory', async () => {
    const items = await uploadManyFiles(paths, { path: DIRECTORY_NAME })
    expect(items).toHaveLength(FILESNAMES.length)
  })
})

describe('Getting files', () => {
  test('Gets 3 files', async () => {
    const SIZE: number = 3
    const data: Paginated<OutputEntity> = await getFiles({ size: SIZE })
    expect(data.items).toHaveLength(SIZE)
  })

  test('Get files from a directory', async () => {
    const data = await getFiles({ path: DIRECTORY_NAME })
    expect(data.items).toHaveLength(FILESNAMES.length)
  })
})

describe('Deleting files', () => {
  test('Delete 1 file', async () => {
    const data: Paginated<OutputEntity> = await getFiles({ size: 1 })
    const file: OutputEntity = data.items[0]

    const entity: OutputEntity = await deleteOneFile(file.id)
    expect(file.name).toBe(entity.name)
  })

  test('Delete many files', async () => {
    const data = await getFiles()

    const keys: string[] = data.items.map(item => item.id)
    const items = await deleteManyFiles(keys)

    expect(items).toHaveLength(data.items.length)
  })

  test('Delete files from a directory', async () => {
    const data = await getFiles({ path: DIRECTORY_NAME })

    const keys: string[] = data.items.map(item => item.Key)
    const items = await deleteManyFiles(keys)

    expect(items).toHaveLength(keys.length)
  })
})
