import { BeeSaveOptions, ILanguage } from '@beefree.io/sdk/dist/types/bee'
import React, { useEffect, useState } from 'react'

interface ControlsProps {
  id: string
  save?: (options?: BeeSaveOptions | undefined) => any
  saveAsTemplate?: (() => any)
  switchTemplateLanguage?: (language: ILanguage) => void
  updateConfig?: (config: any) => void
}

export const Controls = ({
  id,
  save,
  saveAsTemplate,
  updateConfig,
  switchTemplateLanguage,
}: ControlsProps) => {
  const [debug, setDebug] = useState<boolean>(false)

  useEffect(() => {
    if (updateConfig) {
      updateConfig({ debug: { all: debug } })
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
      <button onClick={handleSaveJson}>Save JSON</button>
      <button onClick={handleSaveHtml}>Save HTML</button>
      <button onClick={() => handleSwitchLang('en-US')}>Lang En</button>
      <button onClick={() => handleSwitchLang('it-IT')}>Lang It</button>
      <input id={'debug_chk_' + id} type="checkbox" checked={debug} onChange={e => setDebug(e.target.checked)} />
      <label htmlFor={'debug_chk_' + id}>Debug</label>
    </div>
  )
}
