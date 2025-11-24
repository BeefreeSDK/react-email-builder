import { useCallback, useEffect, useRef, useState } from 'react'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { useBuilderRegistry, setConfigInstanceInRegistry, removeConfigInstanceFromRegistry } from './useRegistry'
import { BeeTypesInstance } from '..'

export const useBuilder = (initialConfig: IBeeConfig) => {
  const [builderRegistry, builderRegistryVersion] = useBuilderRegistry()
  const startVersion = useRef<number>(builderRegistryVersion)
  const [config, setConfig] = useState<IBeeConfig>(initialConfig)
  const [instance, setInstance] = useState<BeeTypesInstance | null>(builderRegistry.get(config.container) ?? null)
  const prevConfigRef = useRef(config)
  const isRegistered = useRef(false)

  // Register config on first render
  if (!isRegistered.current) {
    isRegistered.current = true
    setConfigInstanceInRegistry(initialConfig.container, initialConfig)
  }

  const updateConfig = useCallback((partialConfig: Partial<IBeeConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...partialConfig }))
  }, [])

  // Update registry when config changes via updateConfig
  useEffect(() => {
    if (prevConfigRef.current !== config) {
      prevConfigRef.current = config
      setConfigInstanceInRegistry(config.container, config)
    }
  }, [config, config.container])

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

  return {
    config,
    coeditingSessionId: instance?.token.coediting_session_id,
    token: instance?.token,
    updateConfig,
    reload: instance?.reload,
    preview: instance?.preview,
    load: instance?.load,
    save: instance?.save,
    saveAsTemplate: instance?.saveAsTemplate,
    send: instance?.send,
    join: instance?.join,
    start: instance?.start,
    loadRows: instance?.loadRows,
    switchPreview: instance?.switchPreview,
    togglePreview: instance?.togglePreview,
    toggleComments: instance?.toggleComments,
    switchTemplateLanguage: instance?.switchTemplateLanguage,
    getTemplateJson: instance?.getTemplateJson,
    loadConfig: instance?.loadConfig,
    showComment: instance?.showComment,
    updateToken: instance?.updateToken,
    toggleMergeTagsPreview: instance?.toggleMergeTagsPreview,
    execCommand: instance?.execCommand,
    getConfig: instance?.getConfig,
    loadStageMode: instance?.loadStageMode,
    toggleStructure: instance?.toggleStructure,
    loadWorkspace: instance?.loadWorkspace,
    startFileManager: instance?.startFileManager,
    executeAction: instance?.executeAction,
    executeGetConfigAction: instance?.executeGetConfigAction,
  }
}
