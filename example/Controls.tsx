import React, { useEffect, useState } from 'react'

interface ControlsProps {
  id: string
  save?: () => Promise<any>
  saveAsTemplate?: () => Promise<any>
  updateConfig?: (config: any) => void
}

export const Controls = ({ id, save, saveAsTemplate, updateConfig }: ControlsProps) => {
  const [debug, setDebug] = useState<boolean>(false)

  useEffect(() => {
    if (updateConfig) {
      updateConfig({ debug: { all: debug } })
    }
  }, [debug, updateConfig])

  const handleSaveJson = async () => {
    const template = await saveAsTemplate()
    console.log(`%c[APP] - Controls - handleSaveJson ->`, `color:${'#00ff00'}`, { template: JSON.parse(template.data.json) })
  }
  const handleSaveHtml = async () => {
    const html = await save()
    console.log(`%c[APP] - Controls - handleSaveHtml ->`, `color:${'#00ff00'}`, { html: html.data.html })
  }

  return (
    <div style={{ marginTop: 20, padding: 10, backgroundColor: '#ccc' }}>
      <button onClick={handleSaveJson}>Save JSON</button>
      <button onClick={handleSaveHtml}>Save HTML</button>
      <input id={'debug_chk_' + id} type="checkbox" checked={debug} onChange={e => setDebug(e.target.checked)} />
      <label htmlFor={'debug_chk_' + id}>Debug</label>
    </div>
  )
}
