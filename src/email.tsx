import React, { useEffect, useMemo, useRef, useState } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, ITemplateJson, IToken } from '@beefree.io/sdk/dist/types/bee'
import { BEEPLUGIN_URL, DEFAULT_ID } from './constants'
import {
  addBuilderToRegistry,
  removeBuilderFromRegistry,
} from './hooks/useRegistry'

interface IEmailBuilderProps {
  config: IBeeConfig
  template: ITemplateJson
  token: IToken
  shared?: boolean
  type?: string // potentially used with no-auth-sdk-editor
  width?: React.CSSProperties['width']
  height?: React.CSSProperties['height']
  onError?: (error: Error) => void
  onSessionStarted?: (_: { sessionId: string }) => void
  sessionId?: string
}

const EmailBuilder = (props: IEmailBuilderProps) => {
  const { config: configFromProps, onError, token, template, width, height, shared, sessionId, onSessionStarted } = props

  const config = useMemo(() => ({
    ...configFromProps,
    container: configFromProps.container || DEFAULT_ID,
    onError: onError || configFromProps.onError,
    onSessionStarted: onSessionStarted || configFromProps.onSessionStarted,
  }), [configFromProps, onError, onSessionStarted])
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
      beePluginUrl: BEEPLUGIN_URL,
    })
    const beeInstance = instanceRef.current

    if (shared && sessionId) {
      void beeInstance.join(config, sessionId).then(() => {
        setEditorReady(true)
      })
    }
    else {
      void beeInstance.start(config, template ?? {}, undefined, { shared }).then(() => {
        setEditorReady(true)
      })
    }
  }

  return (
    <div
      id={container}
      style={{
        height: height || '800px',
        width: width || '100%',
      }}
    >
    </div>
  )
}

export default EmailBuilder
