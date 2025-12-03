import { deepMerge } from '../utils'

describe('deepMerge', () => {
  it('merges top-level properties', () => {
    const initial = { a: 1, b: 2 }
    const partial = { b: 3, c: 4 }
    expect(deepMerge(initial, partial)).toEqual({ a: 1, b: 3, c: 4 })
  })

  it('deeply merges nested objects', () => {
    const initial = { hooks: { onSave: () => {}, onLoad: () => {} } }
    const partial: Partial<typeof initial> = { hooks: { onSave: () => 'new', onLoad: () => {} } }
    const result = deepMerge(initial, partial)

    expect(result.hooks.onLoad).toBeDefined()
    expect(result.hooks.onSave).toBe(partial.hooks!.onSave)
  })

  it('replaces arrays instead of merging', () => {
    const initial = { list: [1, 2, 3] }
    const partial = { list: [4, 5] }

    expect(deepMerge(initial, partial)).toEqual({ list: [4, 5] })
  })

  it('handles multiple levels of nesting', () => {
    const initial = { a: { b: { c: 1, d: 2 } } }
    const partial: Partial<typeof initial> = { a: { b: { c: 3, d: 2 } } }

    expect(deepMerge(initial, partial)).toEqual({ a: { b: { c: 3, d: 2 } } })
  })

  it('preserves initial properties not in partial', () => {
    const initial = { a: 1, b: { x: 10, y: 20 } }
    const partial: Partial<typeof initial> = { b: { x: 15, y: 20 } }

    expect(deepMerge(initial, partial)).toEqual({ a: 1, b: { x: 15, y: 20 } })
  })

  it('replaces null values', () => {
    const initial = { a: 'value' as string | null }
    const partial = { a: null }

    expect(deepMerge(initial, partial)).toEqual({ a: null })
  })
})
