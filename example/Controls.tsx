import React from 'react'
import { useBuilder } from '../dist/index.es'

export const Controls = () => {
  const { saveAsTemplate } = useBuilder()
  const handleSaveJson = async () => {
    const template = await saveAsTemplate()
    console.log(`%c[APP] - Controls - handleSaveJson ->`, `color:${'#00ff00'}`, { template: JSON.parse(template.data.json) })
  }

  return (
    <>
      <div>CONTROLS</div>
      <button onClick={handleSaveJson}>Save JSON</button>
    </>
  )
}
