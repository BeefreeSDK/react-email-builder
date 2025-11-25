import { renderHook, act } from '@testing-library/react'
import { useBuilder } from '../useBuilder'
import { setBuilderInstanceToRegistry } from '../useRegistry'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'

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
    expect(result.current.reload).toBe(mockInstance.reload)
    expect(result.current.preview).toBe(mockInstance.preview)
    expect(result.current.load).toBe(mockInstance.load)
    expect(result.current.save).toBe(mockInstance.save)
    expect(result.current.saveAsTemplate).toBe(mockInstance.saveAsTemplate)
    expect(result.current.send).toBe(mockInstance.send)
    expect(result.current.join).toBe(mockInstance.join)
    expect(result.current.start).toBe(mockInstance.start)
    expect(result.current.loadRows).toBe(mockInstance.loadRows)
    expect(result.current.switchPreview).toBe(mockInstance.switchPreview)
    expect(result.current.togglePreview).toBe(mockInstance.togglePreview)
    expect(result.current.toggleComments).toBe(mockInstance.toggleComments)
    expect(result.current.switchTemplateLanguage).toBe(mockInstance.switchTemplateLanguage)
    expect(result.current.getTemplateJson).toBe(mockInstance.getTemplateJson)
    expect(result.current.loadConfig).toBe(mockInstance.loadConfig)
    expect(result.current.showComment).toBe(mockInstance.showComment)
    expect(result.current.updateToken).toBe(mockInstance.updateToken)
    expect(result.current.toggleMergeTagsPreview).toBe(mockInstance.toggleMergeTagsPreview)
    expect(result.current.execCommand).toBe(mockInstance.execCommand)
    expect(result.current.getConfig).toBe(mockInstance.getConfig)
    expect(result.current.loadStageMode).toBe(mockInstance.loadStageMode)
    expect(result.current.toggleStructure).toBe(mockInstance.toggleStructure)
    expect(result.current.loadWorkspace).toBe(mockInstance.loadWorkspace)
    expect(result.current.startFileManager).toBe(mockInstance.startFileManager)
    expect(result.current.executeAction).toBe(mockInstance.executeAction)
    expect(result.current.executeGetConfigAction).toBe(mockInstance.executeGetConfigAction)
  })
})
