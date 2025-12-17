import { renderHook, act } from '@testing-library/react'
import BeefreeSDK from '@beefree.io/sdk'
import {
  ExecCommands, IBeeConfig, IBeeConfigFileManager, IEntityContentJson,
  ILanguage, ILoadStageMode, LoadWorkspaceOptions,
} from '@beefree.io/sdk/dist/types/bee'
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

  it('returns instance methods when registered', () => {
    const mockInstance = {
      token: { coediting_session_id: 'session-123' },
      reload: jest.fn(),
      preview: jest.fn(),
      load: jest.fn(),
      save: jest.fn(),
      saveAsTemplate: jest.fn(),
      send: jest.fn(),
      join: jest.fn(),
      start: jest.fn(),
      loadRows: jest.fn(),
      switchPreview: jest.fn(),
      togglePreview: jest.fn(),
      toggleComments: jest.fn(),
      switchTemplateLanguage: jest.fn(),
      getTemplateJson: jest.fn(),
      loadConfig: jest.fn(),
      showComment: jest.fn(),
      updateToken: jest.fn(),
      toggleMergeTagsPreview: jest.fn(),
      execCommand: jest.fn(),
      getConfig: jest.fn(),
      loadStageMode: jest.fn(),
      toggleStructure: jest.fn(),
      loadWorkspace: jest.fn(),
      startFileManager: jest.fn(),
    } as unknown as BeefreeSDK

    const { result } = renderHook(() => useBuilder(mockConfig))

    act(() => {
      setSDKInstanceToRegistry('test', mockInstance)
    })

    // loadConfig should not be called when instance is first registered since config hasn't changed
    expect(mockInstance.loadConfig).toHaveBeenCalledTimes(0)

    expect(typeof result.current.reload).toBe('function')
    expect(typeof result.current.preview).toBe('function')
    expect(typeof result.current.load).toBe('function')
    expect(typeof result.current.save).toBe('function')
    expect(typeof result.current.saveAsTemplate).toBe('function')
    expect(typeof result.current.send).toBe('function')
    expect(typeof result.current.join).toBe('function')
    expect(typeof result.current.start).toBe('function')
    expect(typeof result.current.loadRows).toBe('function')
    expect(typeof result.current.switchPreview).toBe('function')
    expect(typeof result.current.togglePreview).toBe('function')
    expect(typeof result.current.toggleComments).toBe('function')
    expect(typeof result.current.switchTemplateLanguage).toBe('function')
    expect(typeof result.current.getTemplateJson).toBe('function')
    expect(typeof result.current.loadConfig).toBe('function')
    expect(typeof result.current.showComment).toBe('function')
    expect(typeof result.current.updateToken).toBe('function')
    expect(typeof result.current.toggleMergeTagsPreview).toBe('function')
    expect(typeof result.current.execCommand).toBe('function')
    expect(typeof result.current.getConfig).toBe('function')
    expect(typeof result.current.loadStageMode).toBe('function')
    expect(typeof result.current.toggleStructure).toBe('function')
    expect(typeof result.current.loadWorkspace).toBe('function')
    expect(typeof result.current.startFileManager).toBe('function')

    act(() => {
      result.current.preview()
      result.current.save()
      result.current.saveAsTemplate()
      result.current.switchPreview()
      result.current.togglePreview()
      result.current.toggleComments()
      result.current.getTemplateJson()
      result.current.toggleMergeTagsPreview()
      result.current.getConfig()
      result.current.toggleStructure()
      result.current.loadRows()

      result.current.reload({} as unknown as IEntityContentJson)
      result.current.load({} as unknown as IEntityContentJson)
      result.current.send({} as unknown as ILanguage)
      result.current.join({} as unknown as IBeeConfig, 'session-id')
      result.current.start({} as unknown as IBeeConfig, {})
      result.current.switchTemplateLanguage({} as unknown as ILanguage)
      result.current.loadConfig({})
      result.current.showComment('comment-id')
      result.current.updateToken({ access_token: 'new-token', v2: true })
      result.current.execCommand({} as unknown as ExecCommands)
      result.current.loadStageMode({} as unknown as ILoadStageMode)
      result.current.loadWorkspace({} as unknown as LoadWorkspaceOptions)
      result.current.startFileManager({} as unknown as IBeeConfigFileManager)
    })

    expect(mockInstance.reload).toHaveBeenCalledTimes(1)
    expect(mockInstance.preview).toHaveBeenCalledTimes(1)
    expect(mockInstance.load).toHaveBeenCalledTimes(1)
    expect(mockInstance.save).toHaveBeenCalledTimes(1)
    expect(mockInstance.saveAsTemplate).toHaveBeenCalledTimes(1)
    expect(mockInstance.send).toHaveBeenCalledTimes(1)
    expect(mockInstance.join).toHaveBeenCalledTimes(1)
    expect(mockInstance.start).toHaveBeenCalledTimes(1)
    expect(mockInstance.loadRows).toHaveBeenCalledTimes(1)
    expect(mockInstance.switchPreview).toHaveBeenCalledTimes(1)
    expect(mockInstance.togglePreview).toHaveBeenCalledTimes(1)
    expect(mockInstance.toggleComments).toHaveBeenCalledTimes(1)
    expect(mockInstance.switchTemplateLanguage).toHaveBeenCalledTimes(1)
    expect(mockInstance.getTemplateJson).toHaveBeenCalledTimes(1)
    expect(mockInstance.loadConfig).toHaveBeenCalledTimes(1)
    expect(mockInstance.showComment).toHaveBeenCalledTimes(1)
    expect(mockInstance.updateToken).toHaveBeenCalledTimes(1)
    expect(mockInstance.toggleMergeTagsPreview).toHaveBeenCalledTimes(1)
    expect(mockInstance.execCommand).toHaveBeenCalledTimes(1)
    expect(mockInstance.getConfig).toHaveBeenCalledTimes(1)
    expect(mockInstance.loadStageMode).toHaveBeenCalledTimes(1)
    expect(mockInstance.toggleStructure).toHaveBeenCalledTimes(1)
    expect(mockInstance.loadWorkspace).toHaveBeenCalledTimes(1)
    expect(mockInstance.startFileManager).toHaveBeenCalledTimes(1)
  })

  it('provides stable function references before instance is ready', () => {
    const { result } = renderHook(() => useBuilder(mockConfig))

    // All methods should be functions even before instance is registered
    expect(typeof result.current.reload).toBe('function')
    expect(typeof result.current.preview).toBe('function')
    expect(typeof result.current.load).toBe('function')
    expect(typeof result.current.save).toBe('function')
    expect(typeof result.current.saveAsTemplate).toBe('function')
    expect(typeof result.current.send).toBe('function')
    expect(typeof result.current.join).toBe('function')
    expect(typeof result.current.start).toBe('function')
    expect(typeof result.current.loadRows).toBe('function')
    expect(typeof result.current.switchPreview).toBe('function')
    expect(typeof result.current.togglePreview).toBe('function')
    expect(typeof result.current.toggleComments).toBe('function')
    expect(typeof result.current.switchTemplateLanguage).toBe('function')
    expect(typeof result.current.getTemplateJson).toBe('function')
    expect(typeof result.current.loadConfig).toBe('function')
    expect(typeof result.current.showComment).toBe('function')
    expect(typeof result.current.updateToken).toBe('function')
    expect(typeof result.current.toggleMergeTagsPreview).toBe('function')
    expect(typeof result.current.execCommand).toBe('function')
    expect(typeof result.current.getConfig).toBe('function')
    expect(typeof result.current.loadStageMode).toBe('function')
    expect(typeof result.current.toggleStructure).toBe('function')
    expect(typeof result.current.loadWorkspace).toBe('function')
    expect(typeof result.current.startFileManager).toBe('function')

    expect(() => {
      result.current.preview()
      result.current.save()
      result.current.saveAsTemplate()
      result.current.switchPreview()
      result.current.togglePreview()
      result.current.toggleComments()
      result.current.getTemplateJson()
      result.current.toggleMergeTagsPreview()
      result.current.getConfig()
      result.current.toggleStructure()
      result.current.loadRows()
    }).not.toThrow()
  })
})
