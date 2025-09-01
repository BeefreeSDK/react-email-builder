import React, { useEffect, useRef, useState } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, ITemplateJson, IToken } from '@beefree.io/sdk/dist/types/bee'
import { builderRegistry } from './registry'

const EmailBuilder = (props: {
  config: IBeeConfig
  template: ITemplateJson
  token?: IToken
  shared?: boolean
  type?: string // potentially used with no-auth-sdk-editor
}) => {
  const { config } = props

  const [shouldRender, setShouldRender] = useState(true)

  // instance is created only once for this component
  const instanceRef = useRef(null)

  if (instanceRef.current === null) {
    instanceRef.current = new BeefreeSDK(undefined, {
      beePluginUrl: 'https://pre-bee-app-rsrc.s3.amazonaws.com/plugin/v2/BeePlugin.js',
    })
  }

  useEffect(() => {
    builderRegistry.set(config.container, instanceRef.current)

    if (builderRegistry.size > 1) {
      setShouldRender(false)
    }

    return () => {
      builderRegistry.delete(config.container)
    }
  }, [config.container])

  const beeInstance = instanceRef.current

  beeInstance.UNSAFE_getToken(
    process.env.SDK_CLIENT_ID,
    process.env.SDK_CLIENT_SECRET,
    'test',
    {
      authUrl: 'https://pre-bee-auth.getbee.info/loginV2',
    }).then(() => {
    beeInstance.start(config, {})
  })

  return shouldRender
    ? (
        <div id={config.container} style={{ height: '800px' }}>Email Builder</div>
      )
    : <></>
}

export default EmailBuilder
