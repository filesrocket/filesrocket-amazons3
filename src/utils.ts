export function removeProperties<T, K extends keyof T> (
  payload: T,
  properties: K[]
): Partial<T> {
  const entity = Object.assign({}, payload)
  properties.forEach((p) => delete entity[p])
  return entity
}
