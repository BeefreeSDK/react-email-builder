import { useEffect, useMemo, useRef, useState } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import {
  setSDKInstanceToRegistry,
  removeSDKInstanceFromRegistry,
  getConfigRegistry,
  useSDKInstanceRegistry,
  reserveContainer,
} from './hooks/useRegistry'
import { BuilderPropsWithCallbacks } from './types'

const Builder = (props: BuilderPropsWithCallbacks) => {
  const {
    token,
    template,
    width,
    height,
    shared,
    sessionId,
    loaderUrl,
    bucketDir,
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
  } = props

  const configRegistry = getConfigRegistry()
  const containerKeys = Array.from(configRegistry.keys())
  const [sdkInstanceRegistry] = useSDKInstanceRegistry()
  const [editorReady, setEditorReady] = useState(false)
  const instanceRef = useRef<BeefreeSDK>(null)
  const containerRef = useRef<string | null>(null)

  if (containerRef.current === null) {
    const findFirstContainerWithoutInstance = (): string | null => {
      for (const containerKey of containerKeys) {
        const hasSdkInstance = sdkInstanceRegistry.has(containerKey)

        if (!hasSdkInstance) {
          return containerKey
        }
      }
      return null
    }

    const candidate = findFirstContainerWithoutInstance()

    if (candidate) {
      containerRef.current = candidate
      // Prevent other instances from using the current container
      reserveContainer(candidate)
    }
    else {
      const firstConfig = configRegistry.values().next().value

      if (!firstConfig) {
        throw new Error('Builder requires at least the container in config to be registered')
      }

      containerRef.current = firstConfig.container
    }
  }

  if (!containerRef.current) {
    throw new Error('Failed to initialize container')
  }

  const container = containerRef.current

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
    const configRegistry = getConfigRegistry()
    const builderConfig = configRegistry.get(container) || {}

    return {
      container,
      ...builderConfig,
      // Use callbacks from ref to avoid triggering this memo on callback changes
      ...callbacksRef.current,
    }
  }, [container])

  const configRef = useRef(config)
  configRef.current = config

  useEffect(() => {
    if (editorReady && instanceRef.current) {
      setSDKInstanceToRegistry(container, instanceRef.current)
    }
    return () => {
      removeSDKInstanceFromRegistry(container)
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
        beePluginUrl: loaderUrl,
      })

      const beeInstance = instanceRef.current

      if (shared && sessionId) {
        void beeInstance.join(configRef.current, sessionId, bucketDir).then(() => {
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
