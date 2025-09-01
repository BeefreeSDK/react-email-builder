import React from 'react'
import EmailBuilder, { useBuilder } from '../dist/index.es'

export const App = () => {
  const container = 'test-container'
  const { save: saveHtml } = useBuilder(container)
  return (
    <>
      <h1>Beefree SDK React Demo</h1>
      <p>Welcome to the Beefree SDK React Demo</p>
      <button onClick={() => { saveHtml() }}>Save</button>
      <div id="email-builder">
        <EmailBuilder
          config={{ container, uid: 'test' }}
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
