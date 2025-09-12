import { useRegistry } from './useRegistry'
import { DEFAULT_ID } from '../constants'
import BeefreeSDK from '@beefree.io/sdk'
import { useEffect, useState } from 'react'

export const useBuilder = (id = DEFAULT_ID) => {
  const [builderRegistry, builderRegistryVersion] = useRegistry()
  const [instance, setInstance] = useState<BeefreeSDK>(builderRegistry.get(id))

  useEffect(() => {
    const instanceToRegister = builderRegistry.get(id)
    setInstance(instanceToRegister)
    if (builderRegistry.size > 0 && !instanceToRegister) {
      throw new Error(`No Builder found with id "${id}".
      Make sure to pass the correct id (same as config.container) to the \`useBuilder\` hook
      or to not set the config.container so the hook gets the correct id automatically. `)
    }
  }, [builderRegistry, builderRegistryVersion, id])

  return {
    load: instance?.load,
    save: instance?.save,
    saveAsTemplate: instance?.saveAsTemplate,
  }
}
