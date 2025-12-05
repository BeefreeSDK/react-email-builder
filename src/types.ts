import { IBeeConfig, IEntityContentJson, IToken } from '@beefree.io/sdk/dist/types/bee'
export type * from '@beefree.io/sdk'
import BeeTypesInstance from '@beefree.io/sdk'

export type SDKInstance = NonNullable<BeeTypesInstance>

/**
 * Return type of the useBuilder hook
 */
export interface UseBuilderReturnDocs {
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
  /** Reloads a template without showing loading dialog (seamless reload) */
  reload: SDKInstance['reload']
  /** Shows a preview of the content */
  preview: SDKInstance['preview']
  /** Loads a JSON template into the editor */
  load: SDKInstance['load']
  /** Programmatically triggers the save action */
  save: SDKInstance['save']
  /** Programmatically triggers save as template action */
  saveAsTemplate: SDKInstance['saveAsTemplate']
  /** Programmatically triggers send action (Email Builder only) */
  send: SDKInstance['send']
  /** Joins a collaborative editing session */
  join: SDKInstance['join']
  /** Initializes and starts the builder with optional template data */
  start: SDKInstance['start']
  /** Loads rows into the builder */
  loadRows: SDKInstance['loadRows']
  /** Gets the HTML preview. It also opens the Preview if it’s closed. */
  switchPreview: SDKInstance['switchPreview']
  /** Opens and closes the Preview */
  togglePreview: SDKInstance['togglePreview']
  /** Toggles comments panel */
  toggleComments: SDKInstance['toggleComments']
  /** Switches the template language if the specified language exists in the available languages */
  switchTemplateLanguage: SDKInstance['switchTemplateLanguage']
  /** Gets the template JSON */
  getTemplateJson: SDKInstance['getTemplateJson']
  /** Updates editor configuration dynamically */
  loadConfig: SDKInstance['loadConfig']
  /** Shows a specific comment */
  showComment: SDKInstance['showComment']
  /** Updates the authentication token */
  updateToken: SDKInstance['updateToken']
  /** Toggles visibility of merge tag sample content */
  toggleMergeTagsPreview: SDKInstance['toggleMergeTagsPreview']
  /** Executes specific editor commands for highlighting, scrolling, focusing, or selecting elements */
  execCommand: SDKInstance['execCommand']
  /** Gets the current configuration */
  getConfig: SDKInstance['getConfig']
  /** Loads a stage mode */
  loadStageMode: SDKInstance['loadStageMode']
  /** Toggles visibility of structure outlines in the editor */
  toggleStructure: SDKInstance['toggleStructure']
  /** Loads a specific workspace type */
  loadWorkspace: SDKInstance['loadWorkspace']
  /** Starts the file manager */
  startFileManager: SDKInstance['startFileManager']
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
