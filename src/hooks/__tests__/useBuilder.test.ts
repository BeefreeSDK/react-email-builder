import { renderHook, act } from '@testing-library/react'
import BeefreeSDK from '@beefree.io/sdk'
import { ExecCommands, IBeeConfig, IBeeConfigFileManager, IEntityContentJson, ILanguage, ILoadStageMode, IToken, LoadWorkspaceOptions } from '@beefree.io/sdk/dist/types/bee'
import { useBuilder } from '../useBuilder'
import { setBuilderInstanceToRegistry } from '../useRegistry'

describe('useBuilder', () => {
  const mockConfig: IBeeConfig = { container: 'test', uid: 'user-1', username: 'TestUser', language: 'en' }

  it('registers config on mount', () => {
    const { result } = renderHook(() => useBuilder(mockConfig))
    expect(result.current.config).toEqual(mockConfig)
  })

  it('updates config', () => {
    const { result } = renderHook(() => useBuilder(mockConfig))

    expect(result.current.config.username).toBe('TestUser')
    expect(result.current.config.language).toBe('en')

    act(() => {
      result.current.updateConfig({ username: 'Updated', language: 'fr' })
    })

    expect(result.current.config.username).toBe('Updated')
    expect(result.current.config.language).toBe('fr')
    expect(result.current.config.container).toBe('test')
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
      executeAction: jest.fn(),
      executeGetConfigAction: jest.fn(),
    } as unknown as BeefreeSDK

    const { result } = renderHook(() => useBuilder(mockConfig))

    act(() => {
      setBuilderInstanceToRegistry('test', mockInstance)
    })

    expect(result.current.coeditingSessionId).toBe('session-123')
    expect(result.current.token).toBe(mockInstance.token)

    // Methods are now stable wrapper functions, not direct references
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
    expect(typeof result.current.executeAction).toBe('function')
    expect(typeof result.current.executeGetConfigAction).toBe('function')

    // Verify the wrapper functions actually call the underlying instance methods
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
      result.current.executeGetConfigAction()

      result.current.reload({} as unknown as IEntityContentJson)
      result.current.load({} as unknown as IEntityContentJson)
      result.current.send({} as unknown as ILanguage)
      result.current.join({} as unknown as IBeeConfig, 'session-id')
      result.current.start({} as unknown as IBeeConfig, {})
      result.current.switchTemplateLanguage({} as unknown as ILanguage)
      result.current.loadConfig({})
      result.current.showComment('comment-id')
      result.current.updateToken({} as unknown as IToken)
      result.current.execCommand({} as unknown as ExecCommands)
      result.current.loadStageMode({} as unknown as ILoadStageMode)
      result.current.loadWorkspace({} as unknown as LoadWorkspaceOptions)
      result.current.startFileManager({} as unknown as IBeeConfigFileManager)
      result.current.executeAction('action')
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
    expect(mockInstance.executeAction).toHaveBeenCalledTimes(1)
    expect(mockInstance.executeGetConfigAction).toHaveBeenCalledTimes(1)
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
    expect(typeof result.current.executeAction).toBe('function')
    expect(typeof result.current.executeGetConfigAction).toBe('function')

    // Calling them should not throw errors
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
      result.current.executeGetConfigAction()
    }).not.toThrow()
  })

  it('maintains stable function identity across re-renders when instance does not change', () => {
    const { result, rerender } = renderHook(() => useBuilder(mockConfig))

    // Capture initial function references
    const firstReload = result.current.reload
    const firstPreview = result.current.preview
    const firstLoad = result.current.load
    const firstSave = result.current.save
    const firstSaveAsTemplate = result.current.saveAsTemplate
    const firstSend = result.current.send
    const firstJoin = result.current.join
    const firstStart = result.current.start
    const firstLoadRows = result.current.loadRows
    const firstSwitchPreview = result.current.switchPreview
    const firstTogglePreview = result.current.togglePreview
    const firstToggleComments = result.current.toggleComments
    const firstSwitchTemplateLanguage = result.current.switchTemplateLanguage
    const firstGetTemplateJson = result.current.getTemplateJson
    const firstLoadConfig = result.current.loadConfig
    const firstShowComment = result.current.showComment
    const firstUpdateToken = result.current.updateToken
    const firstToggleMergeTagsPreview = result.current.toggleMergeTagsPreview
    const firstExecCommand = result.current.execCommand
    const firstGetConfig = result.current.getConfig
    const firstLoadStageMode = result.current.loadStageMode
    const firstToggleStructure = result.current.toggleStructure
    const firstLoadWorkspace = result.current.loadWorkspace
    const firstStartFileManager = result.current.startFileManager
    const firstExecuteAction = result.current.executeAction
    const firstExecuteGetConfigAction = result.current.executeGetConfigAction

    rerender()

    // Function references should remain stable across re-renders
    expect(result.current.reload).toBe(firstReload)
    expect(result.current.preview).toBe(firstPreview)
    expect(result.current.load).toBe(firstLoad)
    expect(result.current.save).toBe(firstSave)
    expect(result.current.saveAsTemplate).toBe(firstSaveAsTemplate)
    expect(result.current.send).toBe(firstSend)
    expect(result.current.join).toBe(firstJoin)
    expect(result.current.start).toBe(firstStart)
    expect(result.current.loadRows).toBe(firstLoadRows)
    expect(result.current.switchPreview).toBe(firstSwitchPreview)
    expect(result.current.togglePreview).toBe(firstTogglePreview)
    expect(result.current.toggleComments).toBe(firstToggleComments)
    expect(result.current.switchTemplateLanguage).toBe(firstSwitchTemplateLanguage)
    expect(result.current.getTemplateJson).toBe(firstGetTemplateJson)
    expect(result.current.loadConfig).toBe(firstLoadConfig)
    expect(result.current.showComment).toBe(firstShowComment)
    expect(result.current.updateToken).toBe(firstUpdateToken)
    expect(result.current.toggleMergeTagsPreview).toBe(firstToggleMergeTagsPreview)
    expect(result.current.execCommand).toBe(firstExecCommand)
    expect(result.current.getConfig).toBe(firstGetConfig)
    expect(result.current.loadStageMode).toBe(firstLoadStageMode)
    expect(result.current.toggleStructure).toBe(firstToggleStructure)
    expect(result.current.loadWorkspace).toBe(firstLoadWorkspace)
    expect(result.current.startFileManager).toBe(firstStartFileManager)
    expect(result.current.executeAction).toBe(firstExecuteAction)
    expect(result.current.executeGetConfigAction).toBe(firstExecuteGetConfigAction)
  })
})
