import { useEffect, useMemo, useRef, useState } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { SDK_LOADER_URL } from './constants'
import {
  setBuilderInstanceToRegistry,
  removeBuilderInstanceFromRegistry,
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
  onTemplateLanguageChange,
}: BuilderPropsWithCallbacks) => {

  const container = useMemo(() => {
    if (id) return id

    const registry = getConfigRegistry()
    const firstConfig = registry.values().next().value

    if (!firstConfig) {
      throw new Error('Builder requires at least the container in config to be registered')
    }

    return firstConfig.container
  }, [id])

  const callbacksRef = useRef({
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
    onTemplateLanguageChange,
  })

  const config = useMemo(() => {
    const registry = getConfigRegistry()
    const builderConfig = registry.get(container) || {}

    return {
      container,
      ...builderConfig,
      // Use callbacks from ref to avoid triggering this memo on callback changes
      ...callbacksRef.current,
    }
  }, [container])

  const configRef = useRef(config)
  configRef.current = config

  const [editorReady, setEditorReady] = useState(false)

  // instance is created only once for this component
  const instanceRef = useRef<BeefreeSDK>(null)

  useEffect(() => {
    if (editorReady && instanceRef.current) {
      setBuilderInstanceToRegistry(container, instanceRef.current)
    }
    return () => {
      removeBuilderInstanceFromRegistry(container)
    }
  }, [container, editorReady])

  // Creates and starts SDK instance
  useEffect(() => {
    if (!token) {
      throw new Error('Can\'t start the builder without a token')
    }

    const currentConfig = configRef.current as IBeeConfig

    if (instanceRef.current === null && currentConfig.uid && token) {
      instanceRef.current = new BeefreeSDK(token, {
        beePluginUrl: loaderUrl ?? SDK_LOADER_URL,
      })

      const beeInstance = instanceRef.current

      if (shared && sessionId) {
        void beeInstance.join(configRef.current, sessionId).then(() => {
          setEditorReady(true)
        }).catch((error) => {
          console.error('Error joining the shared session:', error)
        })
      }
      else {
        void beeInstance.start(configRef.current, template, bucketDir, { shared }).then(() => {
          setEditorReady(true)
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
    }
  }, [])

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
