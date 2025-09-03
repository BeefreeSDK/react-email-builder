import BeefreeSDK from '@beefree.io/sdk'
import { DEFAULT_ID } from '../constants'

// Global registry for the builder; probably no need to export it at all
export const builderRegistry = new Map()

export const useRegistry = (id = DEFAULT_ID) => [
  builderRegistry,
  (value: BeefreeSDK) => builderRegistry.set(id, value),
  () => builderRegistry.delete(id),
]
