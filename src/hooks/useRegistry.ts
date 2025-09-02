import BeefreeSDK from '@beefree.io/sdk'
import { builderRegistry } from '../registry'
import { DEFAULT_ID } from '../constants'

export const useRegistry = (id = DEFAULT_ID) => [
  builderRegistry,
  (value: BeefreeSDK) => builderRegistry.set(id, value),
  () => builderRegistry.delete(id),
]
