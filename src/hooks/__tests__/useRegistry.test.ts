import { renderHook, act } from '@testing-library/react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import {
  useSDKInstanceRegistry,
  useConfigRegistry,
  setSDKInstanceToRegistry,
  setConfigInRegistry,
  removeSDKInstanceFromRegistry,
  removeConfigFromRegistry,
} from '../useRegistry'

describe('useRegistry', () => {
  const mockInstance = {} as BeefreeSDK
  const mockConfig: IBeeConfig = { container: 'test', uid: 'user-1' }

  it('registers and retrieves builder instance', () => {
    const { result } = renderHook(() => useSDKInstanceRegistry())

    act(() => {
      setSDKInstanceToRegistry('test', mockInstance)
    })

    const [registry] = result.current
    expect(registry.get('test')).toBe(mockInstance)
  })

  it('registers and retrieves config', () => {
    const { result } = renderHook(() => useConfigRegistry())

    act(() => {
      setConfigInRegistry('test', mockConfig)
    })

    const [registry] = result.current
    expect(registry.get('test')).toEqual(mockConfig)
  })

  it('removes builder instance', () => {
    const { result } = renderHook(() => useSDKInstanceRegistry())

    act(() => {
      setSDKInstanceToRegistry('test', mockInstance)
      removeSDKInstanceFromRegistry('test')
    })

    const [registry] = result.current
    expect(registry.get('test')).toBeUndefined()
  })

  it('removes config instance', () => {
    const { result } = renderHook(() => useConfigRegistry())

    act(() => {
      setConfigInRegistry('test', mockConfig)
      removeConfigFromRegistry('test')
    })

    const [registry] = result.current
    expect(registry.get('test')).toBeUndefined()
  })

  it('increments version on registry update', () => {
    const { result } = renderHook(() => useSDKInstanceRegistry())
    const initialVersion = result.current[1]

    act(() => {
      setSDKInstanceToRegistry('test', mockInstance)
    })

    expect(result.current[1]).toBeGreaterThan(initialVersion)
  })
})
