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

  it('provides stable function references across renders', () => {
    const { result, rerender } = renderHook(() => useBuilder(mockConfig))

    const firstSave = result.current.save
    const firstPreview = result.current.preview

    rerender()

    expect(result.current.save).toBe(firstSave)
    expect(result.current.preview).toBe(firstPreview)
  })
})
