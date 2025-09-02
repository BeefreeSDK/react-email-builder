import React from 'react'
import EmailBuilder, { useBuilder } from '../dist/index.es'

export const App = () => {
  const { save: saveHtml } = useBuilder()
  const handleSave = () => {
    saveHtml()
  }
  return (
    <>
      <h1>Beefree SDK React Demo</h1>
      <p>Welcome to the Beefree SDK React Demo</p>
      <button onClick={handleSave}>Save</button>

      <div id="email-builder">
        <EmailBuilder
          config={{ uid: 'test' }}
          template={{
            data: {
              json: undefined,
              version: 0,
            },
          }}
        />
      </div>
    </>
  )
}
