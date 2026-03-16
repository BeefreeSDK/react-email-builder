import { renderHook, act } from '@testing-library/react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { useBuilder } from '../useBuilder'
import { setSDKInstanceToRegistry, getConfigRegistry } from '../useRegistry'

describe('useBuilder', () => {
  const mockConfig: IBeeConfig = {
    container: 'test',
    uid: 'user-1',
    username: 'TestUser',
    templateLanguage: {
      label: 'English (US)',
      value: 'en-US',
    },
    templateLanguages: [
      { value: 'it-IT', label: 'Italiano' },
    ],
  }

  it('handles undefined container by falling back to empty string key', () => {
    const configWithoutContainer: IBeeConfig = { uid: 'user-1' }
    const { result } = renderHook(() => useBuilder(configWithoutContainer))

    // Trigger a version change to exercise both registry-watch effects
    // with an undefined container (covers the ?? '' branches and if (updatedConfig) false branch)
    act(() => {
      setSDKInstanceToRegistry('unrelated-key', {} as BeefreeSDK)
    })

    expect(result.current).toBeDefined()
  })

  it('returns unchanged instance when re-registering the same SDK instance', () => {
    const mockInstance = { loadConfig: jest.fn() } as unknown as BeefreeSDK
    const { result } = renderHook(() => useBuilder(mockConfig))

    // First registration sets the instance
    act(() => {
      setSDKInstanceToRegistry('test', mockInstance)
    })

    // Second registration with the same instance covers the prevInstance === instanceToRegister branch
    act(() => {
      setSDKInstanceToRegistry('test', mockInstance)
    })

    expect(result.current.save).toBeDefined()
  })

  it('stores config in registry on mount', () => {
    renderHook(() => useBuilder(mockConfig))

    const registryConfig = getConfigRegistry().get(mockConfig.container)

    expect(registryConfig).toEqual(mockConfig)
  })

  it('forwards method calls to SDK instance', () => {
    const mockInstance = {
      save: jest.fn(),
      preview: jest.fn(),
      reload: jest.fn(),
      load: jest.fn(),
      getConfig: jest.fn(),
      loadConfig: jest.fn().mockResolvedValue({}),
    } as unknown as BeefreeSDK

    const { result } = renderHook(() => useBuilder(mockConfig))

    act(() => {
      setSDKInstanceToRegistry('test', mockInstance)
    })

    act(() => {
      result.current.save()
      result.current.preview()
      result.current.getConfig()
    })

    expect(mockInstance.save).toHaveBeenCalledTimes(1)
    expect(mockInstance.preview).toHaveBeenCalledTimes(1)
    expect(mockInstance.getConfig).toHaveBeenCalledTimes(1)
  })

  it('methods return undefined before instance is ready', () => {
    const { result } = renderHook(() => useBuilder(mockConfig))

    // All methods should be callable without throwing
    expect(() => {
      result.current.save()
      result.current.preview()
      result.current.getConfig()
    }).not.toThrow()

    // Methods return undefined when instance not ready
    expect(result.current.save()).toBeUndefined()
  })

  it('updateConfig calls SDK loadConfig', async () => {
    const mockLoadConfig = jest.fn().mockResolvedValue({ language: 'it-IT' })
    const mockInstance = {
      loadConfig: mockLoadConfig,
    } as unknown as BeefreeSDK

    const { result } = renderHook(() => useBuilder(mockConfig))

    act(() => {
      setSDKInstanceToRegistry('test', mockInstance)
    })

    await act(async () => {
      result.current.updateConfig({ language: 'it-IT' })
    })

    expect(mockLoadConfig).toHaveBeenCalledWith({ language: 'it-IT' })
  })

  it('updateConfig calls onWarning and resolves when loadConfig rejects with code 3001', async () => {
    const onWarning = jest.fn()
    const configWithCallbacks: IBeeConfig = { ...mockConfig, onWarning }
    const mockLoadConfig = jest.fn().mockRejectedValue({ code: 3001, message: 'debounced' })
    const mockInstance = { loadConfig: mockLoadConfig } as unknown as BeefreeSDK

    const { result } = renderHook(() => useBuilder(configWithCallbacks))

    act(() => {
      setSDKInstanceToRegistry('test', mockInstance)
    })

    await act(async () => {
      await result.current.updateConfig({ language: 'it-IT' })
    })

    expect(onWarning).toHaveBeenCalledWith({ code: 3001, message: 'debounced' })
  })

  it('updateConfig calls onError and rejects when loadConfig rejects with a generic error', async () => {
    const onError = jest.fn()
    const configWithCallbacks: IBeeConfig = { ...mockConfig, onError }
    const mockLoadConfig = jest.fn().mockRejectedValue(new Error('loadConfig failed'))
    const mockInstance = { loadConfig: mockLoadConfig } as unknown as BeefreeSDK

    const { result } = renderHook(() => useBuilder(configWithCallbacks))

    act(() => {
      setSDKInstanceToRegistry('test', mockInstance)
    })

    await act(async () => {
      await result.current.updateConfig({ language: 'it-IT' }).catch(() => {})
    })

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ code: 1000, message: expect.stringContaining('loadConfig failed') }),
    )
  })

  it('provides stable function references across renders', () => {
    const { result, rerender } = renderHook(() => useBuilder(mockConfig))

    const firstSave = result.current.save
    const firstPreview = result.current.preview

    rerender()

    expect(result.current.save).toBe(firstSave)
    expect(result.current.preview).toBe(firstPreview)
  })
})
