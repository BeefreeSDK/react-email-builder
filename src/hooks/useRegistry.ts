import BeefreeSDK from '@beefree.io/sdk'
import { useSyncExternalStore } from 'react'

type SDKRegistry = Map<string, BeefreeSDK>

// Global registry for the builder; accessed only internally
const builderRegistry: SDKRegistry = new Map()

// Listeners and version to keep React Hooks updated when the registry changes
const listeners = new Set<() => void>()
let version = 0

// Function to notify the listeners and updating version snapshot
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

export function useRegistry(): [SDKRegistry, number] {
  const version = useSyncExternalStore(subscribe, getSnapshot)
  return [builderRegistry, version]
}

// Called by the Builder component to set builder instances to the registry
export const addBuilderToRegistry = (key: string, instance: BeefreeSDK) => {
  builderRegistry.set(key, instance)
  notifyRegistryChanged()
}

// Called by the Builder component to remove builder instances from the registry
export const removeBuilderFromRegistry = (key: string) => {
  builderRegistry.delete(key)
  notifyRegistryChanged()
}
