import { useCallback, useEffect, useRef, useState } from 'react'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import BeeTypesInstance from '@beefree.io/sdk'
import { useSDKInstanceRegistry, setConfigInRegistry, removeConfigFromRegistry } from './useRegistry'
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
  const [sdkInstanceRegistry, sdkInstanceRegistryVersion] = useSDKInstanceRegistry()
  const startVersion = useRef<number>(sdkInstanceRegistryVersion)
  const [config, setConfig] = useState<Partial<IBeeConfig>>(initialConfig)
  const [instance, setInstance] = useState<BeeTypesInstance | null>(sdkInstanceRegistry.get(config.container ?? '') ?? null)
  const isRegistered = useRef(false)
  const instanceToRegister = sdkInstanceRegistry.get(config.container ?? '') ?? null

  // Register config on first render
  if (!isRegistered.current) {
    isRegistered.current = true
    setConfigInRegistry(initialConfig.container, initialConfig)
  }

  const updateConfig = useCallback((partialConfig: Partial<IBeeConfig>) => {
    if (instance) {
      instance.loadConfig(partialConfig).then((configResponse) => {
        setConfig(configResponse)
      }).catch((error) => {
        // debounce warning but handled by the loader
        if (error.code === 3001) {
          console.warn('Warning updating builder config:', error)
        }
        else {
          console.error('Error updating builder config:', error)
        }
      })
    }
  }, [instance])

  useEffect(() => {
    return () => {
      removeConfigFromRegistry(config.container)
    }
  }, [config.container])

  // Listen for changes in the builder registry and update the instance when the builder is registered
  useEffect(() => {
    if (startVersion.current < sdkInstanceRegistryVersion) {
      setInstance((prevInstance) => {
        return prevInstance === instanceToRegister
          ? prevInstance
          : instanceToRegister
      })
    }
  }, [sdkInstanceRegistryVersion])

  const bindMethodToInstance = useCallback(<K extends keyof SDKInstance>(methodName: K) => {
    return (...args: Parameters<SDKInstance[K]>) => {
      const method = instance?.[methodName]
      return typeof method === 'function' ? method(...args) : undefined
    }
  }, [instance])

  return {
    updateConfig,
    reload: bindMethodToInstance('reload'),
    preview: bindMethodToInstance('preview'),
    load: bindMethodToInstance('load'),
    save: bindMethodToInstance('save'),
    saveAsTemplate: bindMethodToInstance('saveAsTemplate'),
    send: bindMethodToInstance('send'),
    join: bindMethodToInstance('join'),
    start: bindMethodToInstance('start'),
    loadRows: bindMethodToInstance('loadRows'),
    switchPreview: bindMethodToInstance('switchPreview'),
    togglePreview: bindMethodToInstance('togglePreview'),
    toggleComments: bindMethodToInstance('toggleComments'),
    switchTemplateLanguage: bindMethodToInstance('switchTemplateLanguage'),
    getTemplateJson: bindMethodToInstance('getTemplateJson'),
    loadConfig: bindMethodToInstance('loadConfig'),
    showComment: bindMethodToInstance('showComment'),
    updateToken: bindMethodToInstance('updateToken'),
    toggleMergeTagsPreview: bindMethodToInstance('toggleMergeTagsPreview'),
    execCommand: bindMethodToInstance('execCommand'),
    getConfig: bindMethodToInstance('getConfig'),
    loadStageMode: bindMethodToInstance('loadStageMode'),
    toggleStructure: bindMethodToInstance('toggleStructure'),
    loadWorkspace: bindMethodToInstance('loadWorkspace'),
    startFileManager: bindMethodToInstance('startFileManager'),
  }
}
