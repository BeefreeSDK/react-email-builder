import {
  ILanguage,
} from '@beefree.io/sdk/dist/types/bee'
import { useEffect, useState } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { UseBuilder } from '../dist/index'

interface ControlsProps {
  id: string
  save?: BeefreeSDK['save']
  saveAsTemplate?: BeefreeSDK['saveAsTemplate']
  switchTemplateLanguage?: (language: ILanguage) => void
  updateConfig?: UseBuilder['updateConfig']
  togglePreview?: () => void
}

export const Controls = ({
  id,
  save,
  saveAsTemplate,
  updateConfig,
  switchTemplateLanguage,
  togglePreview,
}: ControlsProps) => {
  const [debug, setDebug] = useState<boolean>(false)

  useEffect(() => {
    if (updateConfig) {
      void updateConfig({ debug: { all: debug } })
    }
  }, [debug, updateConfig])

  const handleSaveJson = async () => {
    if (!saveAsTemplate) return

    const template = await saveAsTemplate()
    console.log(`%c[APP] - Controls - handleSaveJson ->`, `color:${'#00ff00'}`, { template: JSON.parse(template.data.json) })
  }

  const handleSaveHtml = async () => {
    if (!save) return

    const html = await save()
    console.log(`%c[APP] - Controls - handleSaveHtml ->`, `color:${'#00ff00'}`, { html: html })
  }

  const handleSwitchLang = (language: string) => {
    if (!switchTemplateLanguage) return
    switchTemplateLanguage({ language })

    console.log(`%c[APP] - Controls - handleSwitchLang ->`, `color:${'#00ff00'}`, { language })
  }

  return (
    <div style={{ marginTop: 20, padding: 10, backgroundColor: '#ccc' }}>
      <button onClick={togglePreview}>Preview</button>
      <button onClick={handleSaveJson}>Save JSON</button>
      <button onClick={handleSaveHtml}>Save HTML</button>
      <button onClick={() => handleSwitchLang('en-US')}>Lang En</button>
      <button onClick={() => handleSwitchLang('it-IT')}>Lang It</button>
      <input id={'debug_chk_' + id} type="checkbox" checked={debug} onChange={e => setDebug(e.target.checked)} />
      <label htmlFor={'debug_chk_' + id}>Debug</label>
    </div>
  )
}
