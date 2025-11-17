import React, { useEffect, useMemo, useRef, useState } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { SDK_LOADER_URL, DEFAULT_ID } from './constants'
import {
  addBuilderToRegistry,
  removeBuilderFromRegistry,
} from './hooks/useRegistry'
import { BuilderPropsWithCallbacks } from './types'

const Builder = (props: BuilderPropsWithCallbacks) => {
  const {
    config: configFromProps,
    token,
    template,
    width,
    height,
    shared,
    sessionId,
    loaderUrl,
    bucketDir,
    // Callbacks
    onInstanceReady,
    onLoad = configFromProps.onLoad,
    onPreview = configFromProps.onPreview,
    onTogglePreview = configFromProps.onTogglePreview,
    onSessionStarted = configFromProps.onSessionStarted,
    onSessionChange = configFromProps.onSessionChange,
    onReady = configFromProps.onReady,
    onSave = configFromProps.onSave,
    onSaveRow = configFromProps.onSaveRow,
    onError = configFromProps.onError,
    onAutoSave = configFromProps.onAutoSave,
    onSaveAsTemplate = configFromProps.onSaveAsTemplate,
    onStart = configFromProps.onStart,
    onSend = configFromProps.onSend,
    onChange = configFromProps.onChange,
    onRemoteChange = configFromProps.onRemoteChange,
    onWarning = configFromProps.onWarning,
    onComment = configFromProps.onComment,
    onInfo = configFromProps.onInfo,
    onLoadWorkspace = configFromProps.onLoadWorkspace,
    onViewChange = configFromProps.onViewChange,
    onPreviewChange = configFromProps.onPreviewChange,
  } = props

  const config = useMemo(() => ({
    ...configFromProps,
    container: configFromProps.container || DEFAULT_ID,
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
  }), [
    configFromProps,
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
  const container = config.container
  const [editorReady, setEditorReady] = useState(false)

  // instance is created only once for this component
  const instanceRef = useRef<BeefreeSDK>(null)

  useEffect(() => {
    if (editorReady) {
      instanceRef.current.loadConfig(config)
    }
  }, [config, editorReady])

  useEffect(() => {
    if (editorReady) {
      addBuilderToRegistry(config.container, instanceRef.current)
    }
    return () => {
      removeBuilderFromRegistry(config.container)
    }
  }, [config.container, editorReady])

  if (instanceRef.current === null) {
    if (!token) {
      throw new Error(`Can't start the builder without a token`)
    }
    instanceRef.current = new BeefreeSDK(token, {
      beePluginUrl: loaderUrl ?? SDK_LOADER_URL,
    })
    const beeInstance = instanceRef.current

    if (shared && sessionId) {
      void beeInstance.join(config, sessionId).then(() => {
        setEditorReady(true)
        onInstanceReady(beeInstance)
      }).catch((error) => {
        console.error('Error joining the shared session:', error)
      })
    }
    else {
      void beeInstance.start(config, template, bucketDir, { shared }).then(() => {
        setEditorReady(true)
        onInstanceReady(beeInstance)
      }).catch((error) => {
        console.error('Error starting the builder:', error)
      })
    }
  }

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
