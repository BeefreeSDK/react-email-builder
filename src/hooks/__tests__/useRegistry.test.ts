import { renderHook, act } from '@testing-library/react'
import BeefreeSDK from '@beefree.io/sdk'
import {
  useSDKInstanceRegistry,
  setSDKInstanceToRegistry,
  removeSDKInstanceFromRegistry,
  removeConfigFromRegistry,
  setConfigInRegistry,
  getConfigRegistry,
} from '../useRegistry'

describe('useRegistry', () => {
  const mockInstance = {} as BeefreeSDK

  it('registers and retrieves builder instance', () => {
    const { result } = renderHook(() => useSDKInstanceRegistry())

    act(() => {
      setSDKInstanceToRegistry('test', mockInstance)
    })

    const [registry] = result.current
    expect(registry.get('test')).toBe(mockInstance)
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

  it('increments version on registry update', () => {
    const { result } = renderHook(() => useSDKInstanceRegistry())
    const initialVersion = result.current[1]

    act(() => {
      setSDKInstanceToRegistry('test', mockInstance)
    })

    expect(result.current[1]).toBeGreaterThan(initialVersion)
  })

  it('removeConfigFromRegistry does nothing when key is undefined', () => {
    setConfigInRegistry('keep-me', { container: 'keep-me', uid: 'user-x' })
    removeConfigFromRegistry(undefined)
    expect(getConfigRegistry().has('keep-me')).toBe(true)
  })
})
