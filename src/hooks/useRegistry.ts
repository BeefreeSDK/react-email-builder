import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { useSyncExternalStore } from 'react'

type SDKRegistry = Map<string, BeefreeSDK | null>
type ConfigRegistry = Map<string, IBeeConfig>

// Global registries for the builder; accessed only internally
const sdkInstanceRegistry: SDKRegistry = new Map()
const configRegistry: ConfigRegistry = new Map()

// Listeners and version to keep React Hooks updated when the registry changes
const listeners = new Set<() => void>()
let version = 0

// Notifies the listeners and updates version snapshot
const notifySdkInstanceRegistryChanged = () => {
  version += 1
  listeners.forEach(fn => fn())
}

const subscribe = (callback: () => void) => {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

const getSnapshot = () => version

export function useSDKInstanceRegistry(): [SDKRegistry, number] {
  const version = useSyncExternalStore(subscribe, getSnapshot)
  return [sdkInstanceRegistry, version]
}

export const getConfigRegistry = () => configRegistry

export const setConfigInRegistry = (key: string, config: IBeeConfig) => {
  configRegistry.set(key, config)
}

export const removeConfigFromRegistry = (key?: string) => {
  if (key) {
    configRegistry.delete(key)
  }
}

export const setSDKInstanceToRegistry = (key: string, instance: BeefreeSDK | null) => {
  sdkInstanceRegistry.set(key, instance)
  notifySdkInstanceRegistryChanged()
}

export const removeSDKInstanceFromRegistry = (key: string) => {
  sdkInstanceRegistry.delete(key)
  notifySdkInstanceRegistryChanged()
}

export const resetRegistry = () => {
  sdkInstanceRegistry.clear()
  configRegistry.clear()
  listeners.clear()
  version = 0
}
