import { Paginated, OutputEntity } from 'filesrocket'
import { resolve } from 'path'

import {
  uploadOne,
  uploadMany,
  findOne,
  find,
  remove
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
    const results = await uploadMany(paths)
    expect(results).toHaveLength(paths.length)
  })

  test('Upload single file', async () => {
    const entity = await uploadOne(path)
    expect(typeof entity).toBe('object')
    expect(entity.name).toBe(name)
  })

  test('Upload many files in a directory', async () => {
    const items = await uploadMany(paths, { path: DIRECTORY_NAME })
    expect(items).toHaveLength(FILESNAMES.length)
  })
})

describe('Getting files', () => {
  test('Gets 3 files', async () => {
    const SIZE: number = 3

    const data: Paginated<OutputEntity> = await find({ size: SIZE })

    expect(data.items).toHaveLength(SIZE)
  })

  test('Get files from a directory', async () => {
    const data = await find({ path: DIRECTORY_NAME })

    expect(data.items).toHaveLength(FILESNAMES.length)
  })

  test('Get one file', async () => {
    const data = await find({ size: 1 })

    const entity = data.items.at(0)

    const file = await findOne(entity?.id || '')

    expect(file).toBeTruthy()
    expect(file.name).toBe(entity?.name)
  })

  test('Get file does not exist', async () => {
    await expect(findOne('random.jpg'))
      .rejects
      .toThrowError('File does not exist')
  })
})

describe('Deleting files', () => {
  test('Delete 1 file', async () => {
    const data: Paginated<OutputEntity> = await find({ size: 1 })
    const file: OutputEntity = data.items[0]

    const entities: OutputEntity[] = await remove([file.id])
    const entity = entities.at(0)

    expect(file.name).toBe(entity?.name)
  })

  test('Delete files from a directory', async () => {
    const data = await find({ path: DIRECTORY_NAME })

    const keys: string[] = data.items.map(item => item.Key)
    const items = await remove(keys)

    expect(items).toHaveLength(keys.length)
  })

  test('Delete many files', async () => {
    const data = await find()

    const keys: string[] = data.items.map(item => item.id)
    const items = await remove(keys)

    expect(items).toHaveLength(data.items.length)
  })
})
