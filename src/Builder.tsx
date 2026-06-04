import { useEffect, useMemo, useRef, useState } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import {
  getConfigRegistry,
  removeSDKInstanceFromRegistry,
  setConfigInRegistry,
  setSDKInstanceToRegistry,
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
  const startedRef = useRef(false)

  const config = useMemo<IBeeConfig>(() => {
    const configFromRegistry = configRegistry.get(container) || {}
    const builderConfig = {
      container,
      ...configFromRegistry,
      ...callbacks,
    }
    setConfigInRegistry(container, builderConfig)
    return builderConfig
  }, [configRegistry, container, callbacks])

  useEffect(() => {
    if (editorReady && startedRef.current) {
      try {
        instanceRef.current?.loadConfig?.(callbacks).catch((error) => {
          if (error.code === 3001) {
            callbacksRef.current.onWarning?.(error)
          } else {
            callbacksRef.current.onError?.({ code: 1000, message: `Error updating builder config: ${error}` })
          }
        })
      } catch (error) {
        callbacksRef.current.onError?.({ code: 1000, message: `Error updating builder config: ${error}` })
      }
    }
  }, [callbacks, container, editorReady])

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
        message: `Can't start the builder without a token`,
      })
    }
  }, [token])

  // Construct/start in an effect (not render) so a `disposed` flag in closure
  // can suppress stale start() resolutions from a prior StrictMode mount —
  // otherwise loadConfig fires on a not-yet-started instance and throws
  // "Bee is not started" synchronously from a passive effect.
  useEffect(() => {
    if (!token) return
    if (!config.uid) {
      callbacksRef.current.onError?.({
        message: `Can't start the builder without a uid in the config`,
      })
      return
    }

    let disposed = false

    instanceRef.current = new BeefreeSDK(token, {
      beePluginUrl: loaderUrl,
      ...(process.env.NPM_PACKAGE_NAME && process.env.NPM_PACKAGE_VERSION
        ? {
            wrapperInfo: {
              packageName: process.env.NPM_PACKAGE_NAME,
              packageVersion: process.env.NPM_PACKAGE_VERSION,
            },
          }
        : {}),
    })

    const beeInstance = instanceRef.current

    if (shared && sessionId) {
      void beeInstance.join(config, sessionId, bucketDir).then(() => {
        if (disposed) return
        startedRef.current = true
        setEditorReady(true)
      }).catch((error) => {
        if (disposed) return
        config.onError?.({
          message: `Error joining the shared session: ${error}`,
        })
      })
    } else {
      void beeInstance.start(config, template, bucketDir, { shared }).then(() => {
        if (disposed) return
        startedRef.current = true
        setEditorReady(true)
      }).catch((error) => {
        if (disposed) return
        config.onError?.({
          message: `Error starting the builder: ${error}`,
        })
      })
    }

    return () => {
      disposed = true
      startedRef.current = false
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, container])

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
