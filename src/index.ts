import EmailBuilder from './email'
import { useBuilder } from './hooks/useBuilder'
import { beeTypes } from '@beefree.io/sdk'

export default EmailBuilder
export { EmailBuilder, useBuilder, beeTypes }

export type {
  EmailBuilderCallbacks,
  EmailBuilderProps,
  EmailBuilderPropsWithCallbacks
} from './types'

export { default as BeefreeSDK } from '@beefree.io/sdk'