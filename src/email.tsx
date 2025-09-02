import React, { useEffect, useRef, useState } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, ITemplateJson, IToken } from '@beefree.io/sdk/dist/types/bee'
import { useRegistry } from './hooks/useRegistry'
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

const EmailBuilder = (props: IEmailBuilderProps) => {
  const config = {
    ...props.config,
    container: props.config.container || DEFAULT_ID,
  }
  const container = config.container
  const [shouldRender, setShouldRender] = useState(true)
  const [registry, setBuilder, deleteBuilder] = useRegistry(container)

  // instance is created only once for this component
  const instanceRef = useRef<BeefreeSDK>(null)

  if (instanceRef.current === null) {
    instanceRef.current = new BeefreeSDK(undefined, {
      beePluginUrl: BEEPLUGIN_URL,
    })
  }

  useEffect(() => {
    setBuilder(instanceRef.current)

    if (registry.size > 1) {
      setShouldRender(false)
    }

    return () => {
      deleteBuilder()
    }
  }, [container, deleteBuilder, registry.size, setBuilder])

  const beeInstance = instanceRef.current

  // TODO: use server-side authentication
  beeInstance.UNSAFE_getToken(
    process.env.SDK_CLIENT_ID,
    process.env.SDK_CLIENT_SECRET,
    'test',
    {
      authUrl: BEE_AUTH_URL,
    }).then(() => {
    beeInstance.start(config, props.template ?? {})
  })

  return shouldRender
    ? (
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
    : <></>
}

export default EmailBuilder
