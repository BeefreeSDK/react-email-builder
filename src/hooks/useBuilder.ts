import { useRegistry } from './useRegistry'
import { DEFAULT_ID } from '../constants'
import BeefreeSDK from '@beefree.io/sdk'
import { useEffect, useRef, useState } from 'react'

export const useBuilder = (id = DEFAULT_ID) => {
  const [builderRegistry, builderRegistryVersion] = useRegistry()
  const startVersion = useRef<number>(builderRegistryVersion)
  const [instance, setInstance] = useState<BeefreeSDK>(builderRegistry.get(id))

  useEffect(() => {
    if (startVersion.current < builderRegistryVersion) {
      const instanceToRegister = builderRegistry.get(id)

      setInstance((prevInstance) => {
        // Do not re-render hook listeners if the instance didn't change
        return prevInstance === instanceToRegister
          ? prevInstance
          : instanceToRegister
      })

      // If the instance is not found in registry it means there's no instance with that `id`
      if (!instanceToRegister) {
        throw new Error(`No Builder found with id "${id}".
          Make sure to pass the correct id (same as config.container) to the \`useBuilder\` hook
          or to not set the config.container so the hook gets the correct id automatically. `)
      }
    }
  }, [builderRegistry, builderRegistryVersion, id])

  return {
    load: instance?.load,
    save: instance?.save,
    saveAsTemplate: instance?.saveAsTemplate,
    loadConfig: instance?.loadConfig,
  }
}
