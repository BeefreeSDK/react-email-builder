import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, ITemplateJson, IToken } from '@beefree.io/sdk/dist/types/bee'
import { BEEPLUGIN_URL, BEE_AUTH_URL, DEFAULT_ID } from './constants'

interface IEmailBuilderProps {
  config: IBeeConfig
  template: ITemplateJson
  token?: IToken
  shared?: boolean
  type?: string // potentially used with no-auth-sdk-editor
  width?: React.CSSProperties['width']
  height?: React.CSSProperties['height']
}

const EmailBuilder = forwardRef((props: IEmailBuilderProps, ref: ForwardedRef<BeefreeSDK>) => {
  const config = useMemo(() => ({
    ...props.config,
    container: props.config.container || DEFAULT_ID,
  }), [props.config])
  const container = config.container
  const [editorReady, setEditorReady] = useState(false)

  // instance is created only once for this component
  const instanceRef = useRef<BeefreeSDK>(null)

  useImperativeHandle(ref, () => ({
    // TODO: Map only needed methods
    ...instanceRef.current,
  }))

  useEffect(() => {
    if (editorReady) {
      instanceRef.current.loadConfig(config)
    }
  }, [config, editorReady])

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
      Email Builder
    </div>
  )
})

EmailBuilder.displayName = 'EmailBuilder'

export default EmailBuilder
