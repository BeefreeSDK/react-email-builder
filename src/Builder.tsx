import React, { useEffect, useMemo, useRef, useState } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { SDK_LOADER_URL } from './constants'
import {
  setBuilderInstanceToRegistry,
  removeBuilderInstanceFromRegistry,
  useConfigRegistry,
  getConfigRegistry,
} from './hooks/useRegistry'
import { BuilderPropsWithCallbacks } from './types'

const Builder = ({
  token,
  template,
  width,
  height,
  shared,
  sessionId,
  loaderUrl,
  bucketDir,
  id,
  onLoad,
  onPreview,
  onTogglePreview,
  onSessionStarted,
  onSessionChange,
  onReady,
  onSave,
  onSaveRow,
  onError,
  onAutoSave,
  onSaveAsTemplate,
  onStart,
  onSend,
  onChange,
  onRemoteChange,
  onWarning,
  onComment,
  onInfo,
  onLoadWorkspace,
  onViewChange,
  onPreviewChange,
}: BuilderPropsWithCallbacks) => {
  const [configRegistry, configRegistryVersion] = useConfigRegistry()

  const container = useMemo(() => {
    if (id) return id

    const registry = getConfigRegistry()
    const firstConfig = registry.values().next().value

    if (!firstConfig) {
      throw new Error('Builder requires at least the container in config to be registered')
    }

    return firstConfig.container
  }, [id, configRegistryVersion])

  const config = useMemo(() => {
    const registry = getConfigRegistry()
    const builderConfig = registry.get(container) || {}

    return {
      container,
      ...builderConfig,
      onLoad,
      onPreview,
      onTogglePreview,
      onSessionStarted,
      onSessionChange,
      onReady,
      onSave,
      onSaveRow,
      onError,
      onAutoSave,
      onSaveAsTemplate,
      onStart,
      onSend,
      onChange,
      onRemoteChange,
      onWarning,
      onComment,
      onInfo,
      onLoadWorkspace,
      onViewChange,
      onPreviewChange,
    }
  }, [
    configRegistryVersion,
    container,
    configRegistry,
    onLoad,
    onPreview,
    onTogglePreview,
    onSessionStarted,
    onSessionChange,
    onReady,
    onSave,
    onSaveRow,
    onError,
    onAutoSave,
    onSaveAsTemplate,
    onStart,
    onSend,
    onChange,
    onRemoteChange,
    onWarning,
    onComment,
    onInfo,
    onLoadWorkspace,
    onViewChange,
    onPreviewChange,
  ])

  const configRef = useRef(config)
  configRef.current = config

  const [editorReady, setEditorReady] = useState(false)
  const isInitialLoad = useRef(true)

  // instance is created only once for this component
  const instanceRef = useRef<BeefreeSDK>(null)

  useEffect(() => {
    if (editorReady && instanceRef.current && !isInitialLoad.current) {
      instanceRef.current.loadConfig(configRef.current)
    }
  }, [editorReady, configRegistryVersion])

  useEffect(() => {
    if (editorReady && instanceRef.current) {
      setBuilderInstanceToRegistry(container, instanceRef.current)
    }
    return () => {
      removeBuilderInstanceFromRegistry(container)
    }
  }, [container, editorReady])

  useEffect(() => {
    // Only initialize if we don't have an instance yet and config has uid
    const currentConfig = configRef.current as IBeeConfig

    if (instanceRef.current === null && currentConfig.uid && token) {
      instanceRef.current = new BeefreeSDK(token, {
        beePluginUrl: loaderUrl ?? SDK_LOADER_URL,
      })
      const beeInstance = instanceRef.current

      if (shared && sessionId) {
        void beeInstance.join(configRef.current, sessionId).then(() => {
          setEditorReady(true)
          isInitialLoad.current = false
        }).catch((error) => {
          console.error('Error joining the shared session:', error)
        })
      }
      else {
        void beeInstance.start(configRef.current, template, bucketDir, { shared }).then(() => {
          setEditorReady(true)
          isInitialLoad.current = false
        }).catch((error) => {
          console.error('Error starting the builder:', error)
        })
      }
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current = null
      }
      setEditorReady(false)
      isInitialLoad.current = true
    }
  }, [token, template, shared, sessionId, loaderUrl, bucketDir])

  return (
    <div
      id={container}
      style={{
        height: height || '100%',
        width: width || '100%',
      }}
    >
    </div>
  )
}

export default Builder
