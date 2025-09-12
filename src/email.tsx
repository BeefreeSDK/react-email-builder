import React, { useEffect, useMemo, useRef, useState } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, ITemplateJson, IToken } from '@beefree.io/sdk/dist/types/bee'
import { BEE_AUTH_URL, BEEPLUGIN_URL, DEFAULT_ID } from './constants'
import {
  addBuilderToRegistry,
  removeBuilderFromRegistry,
} from './hooks/useRegistry'

interface IEmailBuilderProps {
  config: IBeeConfig
  template: ITemplateJson
  token?: IToken
  shared?: boolean
  type?: string // potentially used with no-auth-sdk-editor
  width?: React.CSSProperties['width']
  height?: React.CSSProperties['height']
  onError?: (error: Error) => void
}

const EmailBuilder = (props: IEmailBuilderProps) => {
  const { config: configFromProps, onError } = props

  const config = useMemo(() => ({
    ...configFromProps,
    container: configFromProps.container || DEFAULT_ID,
    onError: onError || configFromProps.onError,
    onLoad: () => {
      // setEditorReady(true)
    },
  }), [configFromProps, onError])
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
    instanceRef.current = new BeefreeSDK(undefined, {
      beePluginUrl: BEEPLUGIN_URL,
    })
    const beeInstance = instanceRef.current
    // TODO: we shouldn't call this internally
    beeInstance.UNSAFE_getToken(
      process.env.SDK_CLIENT_ID,
      process.env.SDK_CLIENT_SECRET,
      'test',
      {
        authUrl: BEE_AUTH_URL,
      }).then(() => {
      void beeInstance.start(config, props.template ?? {}).then(() => {
        // TODO: Verify if it's better in the onLoad callback
        setEditorReady(true)
      })
    })
  }

  return (
    <div
      id={container}
      style={{
        height: props.height || '800px',
        width: props.width || '100%',
      }}
    >
    </div>
  )
}

export default EmailBuilder
