import { IBeeConfig, IEntityContentJson, IToken } from '@beefree.io/sdk/dist/types/bee'
export type * from '@beefree.io/sdk'
import BeeTypesInstance from '@beefree.io/sdk'

export type SDKInstance = NonNullable<BeeTypesInstance>

/**
 * Return type of the useBuilder hook
 */
export interface UseBuilderReturnDocs {
  /** The current coediting session ID, if available */
  coeditingSessionId?: string | null
  /** The current SDK token information */
  token?: SDKInstance['token']
  /**
   * Updates the builder configuration dynamically.
   *
   * This will merge the provided partial configuration with the existing config
   * and automatically sync it with the SDK instance if available.
   *
   * @param partialConfig - Partial configuration to merge with current config
   *
   * @example
   * ```tsx
   * // Update a single property
   * updateConfig({ language: 'it-IT' })
   *
   * // Update multiple properties
   * updateConfig({
   *   uid: 'new-user-id',
   *   username: 'New User'
   * })
   * ```
   */
  updateConfig: (partialConfig: Partial<IBeeConfig>) => void
  /** Reloads the builder instance */
  reload: SDKInstance['reload']
  /** Shows a preview of the content */
  preview: SDKInstance['preview']
  /** Loads content into the builder */
  load: SDKInstance['load']
  /** Saves the current content */
  save: SDKInstance['save']
  /** Saves the current content as a template */
  saveAsTemplate: SDKInstance['saveAsTemplate']
  /** Sends the content */
  send: SDKInstance['send']
  /** Joins a collaborative editing session */
  join: SDKInstance['join']
  /** Starts the builder instance */
  start: SDKInstance['start']
  /** Loads rows into the builder */
  loadRows: SDKInstance['loadRows']
  /** Switches the preview mode */
  switchPreview: SDKInstance['switchPreview']
  /** Toggles the preview on/off */
  togglePreview: SDKInstance['togglePreview']
  /** Toggles comments visibility */
  toggleComments: SDKInstance['toggleComments']
  /** Switches the template language */
  switchTemplateLanguage: SDKInstance['switchTemplateLanguage']
  /** Gets the template JSON */
  getTemplateJson: SDKInstance['getTemplateJson']
  /** Loads a new configuration */
  loadConfig: SDKInstance['loadConfig']
  /** Shows a specific comment */
  showComment: SDKInstance['showComment']
  /** Updates the authentication token */
  updateToken: SDKInstance['updateToken']
  /** Toggles merge tags preview */
  toggleMergeTagsPreview: SDKInstance['toggleMergeTagsPreview']
  /** Executes a command in the builder */
  execCommand: SDKInstance['execCommand']
  /** Gets the current configuration */
  getConfig: SDKInstance['getConfig']
  /** Loads a stage mode */
  loadStageMode: SDKInstance['loadStageMode']
  /** Toggles structure view */
  toggleStructure: SDKInstance['toggleStructure']
  /** Loads a workspace configuration */
  loadWorkspace: SDKInstance['loadWorkspace']
  /** Starts the file manager */
  startFileManager: SDKInstance['startFileManager']
  /** Executes an action */
  executeAction: SDKInstance['executeAction']
  /** Executes a get config action */
  executeGetConfigAction: SDKInstance['executeGetConfigAction']
}

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
  onTemplateLanguageChange?: IBeeConfig['onTemplateLanguageChange']
}

export interface BuilderProps {
  template: IEntityContentJson
  token: IToken
  shared?: boolean
  type?: string // potentially used with no-auth-sdk-editor
  width?: React.CSSProperties['width']
  height?: React.CSSProperties['height']
  sessionId?: string
  loaderUrl?: string
  bucketDir?: string
  id?: string
}

export interface BuilderPropsWithCallbacks extends BuilderProps, BuilderCallbacks {}
