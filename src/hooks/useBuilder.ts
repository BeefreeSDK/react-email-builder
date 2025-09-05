import { RefObject } from 'react'
import BeefreeSDK from '@beefree.io/sdk'

export const useBuilder = (instanceRef: RefObject<BeefreeSDK>) => {
  return {
    load: instanceRef.current?.load,
    save: () => instanceRef.current?.save(),
    saveAsTemplate: instanceRef.current?.saveAsTemplate,
  }
}
