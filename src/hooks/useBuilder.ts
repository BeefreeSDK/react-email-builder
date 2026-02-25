import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import {
  useSDKInstanceRegistry,
  setConfigInRegistry,
  removeConfigFromRegistry,
  getConfigRegistry,
} from './useRegistry'
import { SDKInstance, UseBuilder } from '../types'

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
export const useBuilder = (initialConfig: IBeeConfig): UseBuilder => {
  const [sdkInstanceRegistry, sdkInstanceRegistryVersion] = useSDKInstanceRegistry()
  const startVersion = useRef<number>(sdkInstanceRegistryVersion)
  const configRef = useRef<IBeeConfig>(initialConfig)
  const [instance, setInstance] = useState<SDKInstance | null>(sdkInstanceRegistry.get(initialConfig.container ?? '') ?? null)
  const instanceToRegister = sdkInstanceRegistry.get(initialConfig.container ?? '') ?? null

  // Register config the first time the hook is used for a specific container
  const configRegistry = getConfigRegistry()
  if (!configRegistry.has(initialConfig.container)) {
    setConfigInRegistry(initialConfig.container, initialConfig)
  }

  const updateConfig = useCallback((partialConfig: Partial<IBeeConfig>) => (
    new Promise<IBeeConfig>((resolve, reject) => {
      instance?.loadConfig(partialConfig).then((configResponse) => {
        configRef.current = configResponse
        resolve(configResponse)
      }).catch((error) => {
        // debounce warning but handled by the loader
        if (error.code === 3001) {
          configRef.current.onWarning?.(error)
          resolve(configRef.current)
        } else {
          configRef.current.onError?.({ code: 1000, message: `Error updating builder config: ${error}` })
        }
        reject(error)
      })
    })
  ), [instance])

  useEffect(() => {
    return () => {
      removeConfigFromRegistry(initialConfig.container)
    }
  }, [initialConfig.container])

  // Listen for changes in the builder registry and update the instance when the builder is registered
  useEffect(() => {
    if (startVersion.current < sdkInstanceRegistryVersion) {
      setInstance((prevInstance) => {
        return prevInstance === instanceToRegister
          ? prevInstance
          : instanceToRegister
      })
    }
  }, [sdkInstanceRegistryVersion, instanceToRegister])

  // Listen for changes in the builder registry and update config ref
  useEffect(() => {
    if (startVersion.current < sdkInstanceRegistryVersion) {
      const updatedConfig = configRegistry.get(configRef.current.container ?? '')
      if (updatedConfig) {
        configRef.current = updatedConfig
      }
    }
  }, [sdkInstanceRegistryVersion, configRegistry])

  // Memoize all SDK methods to provide stable references across renders
  return useMemo(() => {
    const bindMethod = <K extends keyof SDKInstance>(methodName: K) => {
      return (...args: Parameters<SDKInstance[K]>) => {
        const method = instance?.[methodName]
        return typeof method === 'function' ? method(...args) : undefined
      }
    }

    return {
      id: initialConfig.container,
      updateConfig,
      reload: bindMethod('reload'),
      preview: bindMethod('preview'),
      load: bindMethod('load'),
      save: bindMethod('save'),
      saveAsTemplate: bindMethod('saveAsTemplate'),
      send: bindMethod('send'),
      join: bindMethod('join'),
      start: bindMethod('start'),
      loadRows: bindMethod('loadRows'),
      switchPreview: bindMethod('switchPreview'),
      togglePreview: bindMethod('togglePreview'),
      toggleComments: bindMethod('toggleComments'),
      switchTemplateLanguage: bindMethod('switchTemplateLanguage'),
      getTemplateJson: bindMethod('getTemplateJson'),
      loadConfig: bindMethod('loadConfig'),
      showComment: bindMethod('showComment'),
      updateToken: bindMethod('updateToken'),
      toggleMergeTagsPreview: bindMethod('toggleMergeTagsPreview'),
      execCommand: bindMethod('execCommand'),
      getConfig: bindMethod('getConfig'),
      loadStageMode: bindMethod('loadStageMode'),
      toggleStructure: bindMethod('toggleStructure'),
      loadWorkspace: bindMethod('loadWorkspace'),
      startFileManager: bindMethod('startFileManager'),
    }
  }, [initialConfig.container, instance, updateConfig])
}
