import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { useCallback, useState } from 'react'
import { useBuilder } from './useBuilder'

/**
 * Custom hook for reacting to config updates.
 *
 * If you need your component to react after the config has been updated, this hook is for you.
 *
 * @param {IBeeConfig} initialConfig - The initial configuration for the builder.
 * @returns {[IBeeConfig, (partialConfig: Partial<IBeeConfig>) => Promise<void>]}
 * A tuple containing the current configuration and a function to update the configuration.
 *
 * - The first element is the current configuration object.
 * - The second element is an asynchronous function that receives a partial configuration object,
 *   updates the configuration, and synchronizes the state accordingly.
 *
 * Remember, if you use this hook, you want to prefer using the `updateConfig` function from it over the one
 * coming from `useBuilder`. They would work in any case, but if you call `updateConfig` from the `useBuilder`
 * hook instance, it won't trigger an update on this hook.
 *
 * @example
 * ```tsx
 * const config = {
 *   container: 'bee-editor',
 *   uid: 'user-123',
 *   language: 'en-US'
 * }
 *
 * const {
 *   save,
 *   // updateConfig <-- avoid this if using `useBuilderConfig`
 * } = useBuilder(config)
 *
 * const [config, updateConfig] = useBuilderConfig(initialConfig)
 *
 * // Update configuration dynamically
 * updateConfig({ language: 'it-IT' })
 *
 * useEffect(() => {
 *   // perform actions when config has been updated
 * }, [config])
 * ```
 *
 */
export const useBuilderConfig = (
  initialConfig: IBeeConfig,
): [IBeeConfig, (partialConfig: Partial<IBeeConfig>) => Promise<void>] => {
  const { updateConfig } = useBuilder(initialConfig)
  const [config, setConfig] = useState(initialConfig)

  const handleUpdateConfig = useCallback(async (partialConfig: Partial<IBeeConfig>) => {
    const updatedConfig = await updateConfig(partialConfig)
    setConfig(updatedConfig)
  }, [updateConfig])

  return [config, handleUpdateConfig]
}
