import { builderRegistry } from '../registry'
import { useEffect, useRef } from 'react'

export const useBuilder = (id: string) => {
  const instanceRef = useRef(builderRegistry.get(id))

  useEffect(() => {
    instanceRef.current = instanceRef.current ?? builderRegistry.get(id)
    if (!instanceRef.current) {
      throw new Error(`No Builder found with id "${id}"`)
    }
  }, [builderRegistry.size, id])

  return {
    load: () => instanceRef.current.load(),
    save: () => instanceRef.current.save(),
    saveAsTemplate: () => instanceRef.current.saveAsTemplate(),
  }
}
