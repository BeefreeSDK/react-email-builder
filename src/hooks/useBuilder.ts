import { useCallback, useEffect, useRef, useState } from 'react'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { useBuilderRegistry, setConfigInstanceInRegistry, removeConfigInstanceFromRegistry } from './useRegistry'
import BeeTypesInstance from '@beefree.io/sdk'
import { SDKInstance, UseBuilderReturnDocs } from '../types'

/**
 * Hook for programmatic control of a Beefree SDK builder instance.
 *
 * This hook provides methods to interact with the builder and allows
 * dynamic configuration updates after initialization.
 *
 * @param initialConfig - The initial configuration for the builder instance
 * @returns Object containing builder methods and configuration update function
 *
 * @example
 * ```tsx
 * const config = {
 *   container: 'bee-editor',
 *   uid: 'user-123',
 *   language: 'en-US'
 * }
 *
 * const { updateConfig, save, getConfig } = useBuilder(config)
 *
 * // Update configuration dynamically
 * updateConfig({ language: 'it-IT' })
 *
 * // Save content
 * const result = await save()
 * ```
 */
export const useBuilder = (initialConfig: IBeeConfig): UseBuilderReturnDocs => {
  const [builderRegistry, builderRegistryVersion] = useBuilderRegistry()
  const startVersion = useRef<number>(builderRegistryVersion)
  const [config, setConfig] = useState<IBeeConfig>(initialConfig)
  const [instance, setInstance] = useState<BeeTypesInstance | null>(builderRegistry.get(config.container) ?? null)
  const isRegistered = useRef(false)

  // Register config on first render
  if (!isRegistered.current) {
    isRegistered.current = true
    setConfigInstanceInRegistry(initialConfig.container, initialConfig)
  }

  const updateConfig = useCallback((partialConfig: Partial<IBeeConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...partialConfig }))
  }, [])

  useEffect(() => {
    setConfigInstanceInRegistry(config.container, config)

    if (instance) {
      instance.loadConfig?.(config)
    }

    // Instance should not be listed
    // since loadConfig should run only when config changes
  }, [config])

  useEffect(() => {
    return () => {
      removeConfigInstanceFromRegistry(config.container)
    }
  }, [config.container])

  // Listen for changes in the builder registry and update the instance when the builder is registered
  useEffect(() => {
    if (startVersion.current < builderRegistryVersion) {
      const instanceToRegister = builderRegistry.get(config.container) ?? null

      setInstance((prevInstance) => {
        // Do not re-render hook listeners if the instance didn't change
        return prevInstance === instanceToRegister
          ? prevInstance
          : instanceToRegister
      })
    }
  }, [builderRegistry, builderRegistryVersion, config.container])

  // Helper to create stable wrapper functions that safely handle calls before initialization
  const createMethodWrapper = useCallback(<K extends keyof SDKInstance>(methodName: K) => {
    return (...args: Parameters<SDKInstance[K]>) => {
      const method = instance?.[methodName]
      return typeof method === 'function' ? method(...args) : undefined
    }
  }, [instance])

  const reload = useCallback(createMethodWrapper('reload'), [createMethodWrapper])
  const preview = useCallback(createMethodWrapper('preview'), [createMethodWrapper])
  const load = useCallback(createMethodWrapper('load'), [createMethodWrapper])
  const save = useCallback(createMethodWrapper('save'), [createMethodWrapper])
  const saveAsTemplate = useCallback(createMethodWrapper('saveAsTemplate'), [createMethodWrapper])
  const send = useCallback(createMethodWrapper('send'), [createMethodWrapper])
  const join = useCallback(createMethodWrapper('join'), [createMethodWrapper])
  const start = useCallback(createMethodWrapper('start'), [createMethodWrapper])
  const loadRows = useCallback(createMethodWrapper('loadRows'), [createMethodWrapper])
  const switchPreview = useCallback(createMethodWrapper('switchPreview'), [createMethodWrapper])
  const togglePreview = useCallback(createMethodWrapper('togglePreview'), [createMethodWrapper])
  const toggleComments = useCallback(createMethodWrapper('toggleComments'), [createMethodWrapper])
  const switchTemplateLanguage = useCallback(createMethodWrapper('switchTemplateLanguage'), [createMethodWrapper])
  const getTemplateJson = useCallback(createMethodWrapper('getTemplateJson'), [createMethodWrapper])
  const loadConfig = useCallback(createMethodWrapper('loadConfig'), [createMethodWrapper])
  const showComment = useCallback(createMethodWrapper('showComment'), [createMethodWrapper])
  const updateToken = useCallback(createMethodWrapper('updateToken'), [createMethodWrapper])
  const toggleMergeTagsPreview = useCallback(createMethodWrapper('toggleMergeTagsPreview'), [createMethodWrapper])
  const execCommand = useCallback(createMethodWrapper('execCommand'), [createMethodWrapper])
  const getConfig = useCallback(createMethodWrapper('getConfig'), [createMethodWrapper])
  const loadStageMode = useCallback(createMethodWrapper('loadStageMode'), [createMethodWrapper])
  const toggleStructure = useCallback(createMethodWrapper('toggleStructure'), [createMethodWrapper])
  const loadWorkspace = useCallback(createMethodWrapper('loadWorkspace'), [createMethodWrapper])
  const startFileManager = useCallback(createMethodWrapper('startFileManager'), [createMethodWrapper])
  const executeAction = useCallback(createMethodWrapper('executeAction'), [createMethodWrapper])
  const executeGetConfigAction = useCallback(createMethodWrapper('executeGetConfigAction'), [createMethodWrapper])

  return {
    coeditingSessionId: instance?.token.coediting_session_id,
    token: instance?.token,
    updateConfig,
    reload,
    preview,
    load,
    save,
    saveAsTemplate,
    send,
    join,
    start,
    loadRows,
    switchPreview,
    togglePreview,
    toggleComments,
    switchTemplateLanguage,
    getTemplateJson,
    loadConfig,
    showComment,
    updateToken,
    toggleMergeTagsPreview,
    execCommand,
    getConfig,
    loadStageMode,
    toggleStructure,
    loadWorkspace,
    startFileManager,
    executeAction,
    executeGetConfigAction,
  }
}
