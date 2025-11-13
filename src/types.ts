import { IBeeConfig, ITemplateJson, IToken } from '@beefree.io/sdk/dist/types/bee'
export type * from '@beefree.io/sdk'

export interface BuilderCallbacks {
  onLoad?: IBeeConfig['onLoad']
  onPreview?: IBeeConfig['onPreview']
  onTogglePreview?: IBeeConfig['onTogglePreview']
  onSessionStarted?: IBeeConfig['onSessionStarted']
  onSessionChange?: IBeeConfig['onSessionChange']
  onReady?: IBeeConfig['onReady']
  onSave?: IBeeConfig['onSave']
  onSaveRow?: IBeeConfig['onSaveRow']
  onError?: IBeeConfig['onError']
  onAutoSave?: IBeeConfig['onAutoSave']
  onSaveAsTemplate?: IBeeConfig['onSaveAsTemplate']
  onStart?: IBeeConfig['onStart']
  onSend?: IBeeConfig['onSend']
  onChange?: IBeeConfig['onChange']
  onRemoteChange?: IBeeConfig['onRemoteChange']
  onWarning?: IBeeConfig['onWarning']
  onComment?: IBeeConfig['onComment']
  onInfo?: IBeeConfig['onInfo']
  onLoadWorkspace?: IBeeConfig['onLoadWorkspace']
  onViewChange?: IBeeConfig['onViewChange']
  onPreviewChange?: IBeeConfig['onPreviewChange']
}

export interface BuilderProps {
  config: IBeeConfig
  template: ITemplateJson
  token: IToken
  shared?: boolean
  type?: string // potentially used with no-auth-sdk-editor
  width?: React.CSSProperties['width']
  height?: React.CSSProperties['height']
  sessionId?: string
  loaderUrl?: string  
}

export interface BuilderPropsWithCallbacks extends BuilderProps, BuilderCallbacks {}