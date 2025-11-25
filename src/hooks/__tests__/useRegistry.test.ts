import { renderHook, act } from '@testing-library/react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import {
  useBuilderRegistry,
  useConfigRegistry,
  setBuilderInstanceToRegistry,
  setConfigInstanceInRegistry,
  removeBuilderInstanceFromRegistry,
  removeConfigInstanceFromRegistry,
} from '../useRegistry'

describe('useRegistry', () => {
  const mockInstance = {} as BeefreeSDK
  const mockConfig: IBeeConfig = { container: 'test', uid: 'user-1' }

  it('registers and retrieves builder instance', () => {
    const { result } = renderHook(() => useBuilderRegistry())

    act(() => {
      setBuilderInstanceToRegistry('test', mockInstance)
    })

    const [registry] = result.current
    expect(registry.get('test')).toBe(mockInstance)
  })

  it('registers and retrieves config', () => {
    const { result } = renderHook(() => useConfigRegistry())

    act(() => {
      setConfigInstanceInRegistry('test', mockConfig)
    })

    const [registry] = result.current
    expect(registry.get('test')).toEqual(mockConfig)
  })

  it('removes builder instance', () => {
    const { result } = renderHook(() => useBuilderRegistry())

    act(() => {
      setBuilderInstanceToRegistry('test', mockInstance)
      removeBuilderInstanceFromRegistry('test')
    })

    const [registry] = result.current
    expect(registry.get('test')).toBeUndefined()
  })

  it('removes config instance', () => {
    const { result } = renderHook(() => useConfigRegistry())

    act(() => {
      setConfigInstanceInRegistry('test', mockConfig)
      removeConfigInstanceFromRegistry('test')
    })

    const [registry] = result.current
    expect(registry.get('test')).toBeUndefined()
  })

  it('increments version on registry update', () => {
    const { result } = renderHook(() => useBuilderRegistry())
    const initialVersion = result.current[1]

    act(() => {
      setBuilderInstanceToRegistry('test', mockInstance)
    })

    expect(result.current[1]).toBeGreaterThan(initialVersion)
  })
})
