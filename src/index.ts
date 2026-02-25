import BeeTypesInstance from '@beefree.io/sdk'
import Builder from './Builder'
import { useBuilder } from './hooks/useBuilder'

export * from '@beefree.io/sdk/dist/types/bee'
export { Builder, useBuilder, BeeTypesInstance }
export type {
  BuilderCallbacks,
  BuilderProps,
  BuilderPropsWithCallbacks,
  UseBuilder,
} from './types'

// Re-export runtime values from SDK to ensure they're available in ESM bundle
export {
  StageModeOptions,
  StageDisplayOptions,
  SidebarTabs,
  ExecCommands,
  LoadWorkspaceOptions,
  BeePluginErrorCodes,
  OnInfoDetailHandle,
  ModuleTypes,
  ModuleDescriptorNames,
  ModuleDescriptorOrderNames,
  RowLayoutType,
  EngageHandle,
  OnCommentChangeEnum,
  WorkspaceStage,
  ContentCodes,
  ActionCodes,
  EventCodes,
  BeePluginRoles,
  TokenStatus,
  PREVIEW_CONTROL,
} from '@beefree.io/sdk/dist/types/bee'
