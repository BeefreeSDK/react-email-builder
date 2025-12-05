import { useCallback, useEffect, useRef, useState } from 'react'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import BeeTypesInstance from '@beefree.io/sdk'
import { useBuilderRegistry, setConfigInstanceInRegistry, removeConfigInstanceFromRegistry } from './useRegistry'
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
  const [config, setConfig] = useState<Partial<IBeeConfig>>(initialConfig)
  const [instance, setInstance] = useState<BeeTypesInstance | null>(builderRegistry.get(config.container ?? '') ?? null)
  const isRegistered = useRef(false)
  const instanceToRegister = builderRegistry.get(config.container ?? '') ?? null

  // Register config on first render
  if (!isRegistered.current) {
    isRegistered.current = true
    setConfigInstanceInRegistry(initialConfig.container, initialConfig)
  }

  const updateConfig = useCallback(async (partialConfig: Partial<IBeeConfig>) => {
    if (instance) {
      instance.loadConfig(partialConfig).then((configResponse) => {
        setConfig(configResponse)
      })
    }
  }, [instance])

  useEffect(() => {
    return () => {
      removeConfigInstanceFromRegistry(config.container)
    }
  }, [config.container])

  // Listen for changes in the builder registry and update the instance when the builder is registered
  useEffect(() => {
    if (startVersion.current < builderRegistryVersion) {
      setInstance((prevInstance) => {
        return prevInstance === instanceToRegister
          ? prevInstance
          : instanceToRegister
      })
    }
  }, [builderRegistryVersion])

  const createSafeMethodWrapper = <K extends keyof SDKInstance>(methodName: K) => {
    return (...args: Parameters<SDKInstance[K]>) => {
      const method = instance?.[methodName]
      return typeof method === 'function' ? method(...args) : undefined
    }
  }

  const reload = useCallback(createSafeMethodWrapper('reload'), [instance])
  const preview = useCallback(createSafeMethodWrapper('preview'), [instance])
  const load = useCallback(createSafeMethodWrapper('load'), [instance])
  const save = useCallback(createSafeMethodWrapper('save'), [instance])
  const saveAsTemplate = useCallback(createSafeMethodWrapper('saveAsTemplate'), [instance])
  const send = useCallback(createSafeMethodWrapper('send'), [instance])
  const join = useCallback(createSafeMethodWrapper('join'), [instance])
  const start = useCallback(createSafeMethodWrapper('start'), [instance])
  const loadRows = useCallback(createSafeMethodWrapper('loadRows'), [instance])
  const switchPreview = useCallback(createSafeMethodWrapper('switchPreview'), [instance])
  const togglePreview = useCallback(createSafeMethodWrapper('togglePreview'), [instance])
  const toggleComments = useCallback(createSafeMethodWrapper('toggleComments'), [instance])
  const switchTemplateLanguage = useCallback(createSafeMethodWrapper('switchTemplateLanguage'), [instance])
  const getTemplateJson = useCallback(createSafeMethodWrapper('getTemplateJson'), [instance])
  const loadConfig = useCallback(createSafeMethodWrapper('loadConfig'), [instance])
  const showComment = useCallback(createSafeMethodWrapper('showComment'), [instance])
  const updateToken = useCallback(createSafeMethodWrapper('updateToken'), [instance])
  const toggleMergeTagsPreview = useCallback(createSafeMethodWrapper('toggleMergeTagsPreview'), [instance])
  const execCommand = useCallback(createSafeMethodWrapper('execCommand'), [instance])
  const getConfig = useCallback(createSafeMethodWrapper('getConfig'), [instance])
  const loadStageMode = useCallback(createSafeMethodWrapper('loadStageMode'), [instance])
  const toggleStructure = useCallback(createSafeMethodWrapper('toggleStructure'), [instance])
  const loadWorkspace = useCallback(createSafeMethodWrapper('loadWorkspace'), [instance])
  const startFileManager = useCallback(createSafeMethodWrapper('startFileManager'), [instance])

  return {
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
  }
}
