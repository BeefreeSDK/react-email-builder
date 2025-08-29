import React, { ChangeEvent } from 'react'
import EmailBuilder from '../src'
import { useBuilderActions } from '../src/email'

const Test = () => {
  const { load } = useBuilderActions()
  return (
    <input
      type="file"
      accept="application/json"
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        const templateFile = e.target.files[0]
        const reader = new FileReader()

        reader.onload = function () {
          const templateString = reader.result as string
          const template = JSON.parse(templateString)
          load(template)
        }

        reader.readAsText(templateFile)
      }}
    />
  )
}
export const App = () => {
  return (
    <>
      <h1>Beefree SDK React Demo</h1>
      <p>Welcome to the Beefree SDK React Demo</p>
      <div id="email-builder">
        <EmailBuilder
          config={{ container: 'test-container', uid: 'test' }}
          template={{
            data: {
              json: undefined,
              version: 0,
            },
          }}
        >
          <Test />
        </EmailBuilder>
      </div>
    </>
  )
}
