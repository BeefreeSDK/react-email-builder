import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { useSyncExternalStore } from 'react'

type SDKRegistry = Map<string, BeefreeSDK>
type ConfigRegistry = Map<string, IBeeConfig>

// Global registries for the builder; accessed only internally
const builderRegistry: SDKRegistry = new Map()
const configRegistry: ConfigRegistry = new Map()

// Listeners and version to keep React Hooks updated when the registry changes
const listeners = new Set<() => void>()
let version = 0

// Notifies the listeners and updates version snapshot
const notifyRegistryChanged = () => {
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

export function useBuilderRegistry(): [SDKRegistry, number] {
  const version = useSyncExternalStore(subscribe, getSnapshot)
  return [builderRegistry, version]
}

export function useConfigRegistry(): [ConfigRegistry, number] {
  const version = useSyncExternalStore(subscribe, getSnapshot)
  return [configRegistry, version]
}

export const getConfigRegistry = () => configRegistry

export const setBuilderInstanceToRegistry = (key: string, instance: BeefreeSDK) => {
  builderRegistry.set(key, instance)
  notifyRegistryChanged()
}

export const setConfigInstanceInRegistry = (key: string, config: IBeeConfig) => {
  configRegistry.set(key, config)
  notifyRegistryChanged()
}

export const removeBuilderInstanceFromRegistry = (key: string) => {
  builderRegistry.delete(key)
  notifyRegistryChanged()
}

export const removeConfigInstanceFromRegistry = (key: string) => {
  configRegistry.delete(key)
  notifyRegistryChanged()
}
