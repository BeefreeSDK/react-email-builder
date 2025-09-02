import { useEffect, useRef } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { DEFAULT_ID } from '../constants'
import { useRegistry } from './useRegistry'

export const useBuilder = (id = DEFAULT_ID) => {
  const [registry] = useRegistry(id)
  const instanceRef = useRef<BeefreeSDK>(registry.get(id))

  useEffect(() => {
    instanceRef.current = instanceRef?.current ?? registry.get(id)
    if (!instanceRef?.current) {
      throw new Error(`No Builder found with id "${id}"`)
    }
  }, [registry.size, id]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    load: instanceRef?.current?.load,
    save: instanceRef?.current?.save,
    saveAsTemplate: instanceRef?.current?.saveAsTemplate,
  }
}
