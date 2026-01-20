import { useEffect, useMemo, useRef, useState } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import {
  setSDKInstanceToRegistry,
  removeSDKInstanceFromRegistry,
  getConfigRegistry,
} from './hooks/useRegistry'
import { BuilderPropsWithCallbacks } from './types'

const Builder = (props: BuilderPropsWithCallbacks) => {
  const {
    id: container,
    token,
    template,
    width,
    height,
    shared,
    sessionId,
    loaderUrl,
    bucketDir,
    ...callbacks
  } = props

  const callbacksRef = useRef(callbacks)

  const configRegistry = getConfigRegistry()
  const [editorReady, setEditorReady] = useState(false)
  const instanceRef = useRef<BeefreeSDK>(null)

  const config = useMemo<IBeeConfig>(() => {
    const builderConfig = configRegistry.get(container) || {}
    return {
      container,
      ...builderConfig,
      ...callbacks,
    }
  }, [configRegistry, container, callbacks])

  useEffect(() => {
    if (editorReady) {
      instanceRef.current?.loadConfig?.(callbacks)
    }
  }, [callbacks, editorReady])

  useEffect(() => {
    if (editorReady && instanceRef.current) {
      setSDKInstanceToRegistry(container, instanceRef.current)
    }
    return () => {
      removeSDKInstanceFromRegistry(container)
    }
  }, [container, editorReady])

  useEffect(() => {
    callbacksRef.current = callbacks
  }, [callbacks])

  useEffect(() => {
    if (!token) {
      callbacksRef.current.onError?.({
        message: 'Can\'t start the builder without a token',
      })
    }
  }, [token])

  // Creates and starts SDK instance
  if (instanceRef.current === null && token) {
    const currentConfig = config as IBeeConfig
    if (currentConfig.uid) {
      instanceRef.current = new BeefreeSDK(token, {
        beePluginUrl: loaderUrl,
      })

      const beeInstance = instanceRef.current

      if (shared && sessionId) {
        void beeInstance.join(config, sessionId, bucketDir).then(() => {
          setEditorReady(true)
        }).catch((error) => {
          config.onError?.({
            message: `Error joining the shared session: ${error}`,
          })
        })
      }
      else {
        void beeInstance.start(config, template, bucketDir, { shared }).then(() => {
          setEditorReady(true)
        }).catch((error) => {
          config.onError?.({
            message: `Error starting the builder: ${error}`,
          })
        })
      }
    }
  }

  useEffect(() => {
    return () => {
      // SDK doesn't provide a destroy/dispose method, so we manually clean up
      // by clearing the container's content (removes iframe and event listeners)
      const containerElement = document.getElementById(container)
      if (containerElement) {
        containerElement.innerHTML = ''
      }

      if (instanceRef.current) {
        instanceRef.current = null
      }
      setEditorReady(false)
    }
  }, [container])

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
