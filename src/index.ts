import EmailBuilder from './email'
import { useBuilder } from './hooks/useBuilder'
import BeeTypesInstance, { beeTypes } from '@beefree.io/sdk'

export { EmailBuilder, useBuilder, beeTypes, BeeTypesInstance }

export type {
  EmailBuilderCallbacks,
  EmailBuilderProps,
  EmailBuilderPropsWithCallbacks,
} from './types'