import React, { createContext, useContext, useRef } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, ITemplateJson, IToken } from '@beefree.io/sdk/dist/types/bee'

export function useBuilder() {
  const ctx = useContext(BuilderContext)
  if (!ctx) {
    throw new Error('useBuilder must be used inside a <Builder />')
  }
  return ctx
}

export function useBuilderActions() {
  const builder = useBuilder()
  return {
    load: (...args) => builder.load(...args),
    loadConfig: (...args) => builder.loadConfig(...args),
    save: (...args) => builder.save(...args),
  }
}
const BuilderContext = createContext(null)

const EmailBuilder = (props: {
  config: IBeeConfig
  template: ITemplateJson
  token?: IToken
  shared?: boolean
  type?: string // potentially used with no-auth-sdk-editor
  children?: React.ReactNode
}) => {
  const { config, children } = props
  // instance is created only once for this component
  const instanceRef = useRef(null)

  if (instanceRef.current === null) {
    instanceRef.current = new BeefreeSDK(undefined, {
      beePluginUrl: 'https://pre-bee-app-rsrc.s3.amazonaws.com/plugin/v2/BeePlugin.js',
    })
  }

  const beeInstance = instanceRef.current

  console.log(`%csf: email - EmailBuilder ->`, `color:${'#00ff00'}`, { beeInstance })

  beeInstance.UNSAFE_getToken(
    process.env.SDK_CLIENT_ID,
    process.env.SDK_CLIENT_SECRET,
    'test',
    {
      authUrl: 'https://pre-bee-auth.getbee.info/loginV2',
    }).then(() => {
    beeInstance.start(config, {}).then((instance) => {
      console.log(`%csf: email -  ->`, `color:${'#00ff00'}`, { instance })
    })
  })

  return (
    <BuilderContext.Provider value={instanceRef.current}>
      <div id={config.container} style={{ height: '800px' }}>Email Builder</div>
      {children}
    </BuilderContext.Provider>
  )
}

export default EmailBuilder
