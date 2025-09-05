import React, { useMemo, useRef, useState } from 'react'
import EmailBuilder, { useBuilder } from '../dist/index.es'
import BeefreeSDK from '@beefree.io/sdk'

export const App = () => {
  const builderRef = useRef<BeefreeSDK>(null)
  const [users, setUsers] = useState<string[]>(['pippo'])
  const [debug, setDebug] = useState<boolean>(false)
  const { save: saveHtml } = useBuilder(builderRef)
  const handleSave = () => {
    setUsers(['pippo', 'pluto'])
    saveHtml()
  }

  const config = useMemo(() => ({
    id: 'test',
    hooks: {
      getMentions: {
        handler: async (resolve) => {
          resolve(users.map(user => ({
            userColor: '#ff0000',
            username: user,
            value: user,
            uid: user,
          })),
          )
        },
      },
    },
    contentDialog: {
      saveRow: {
        label: 'Save',
        handler: async (resolve) => {
          resolve({ name: 'row' })
        },
      },
    },
    debug: {
      all: debug,
    },
  }), [users, debug])

  return (
    <>
      <h1>Beefree SDK React Demo</h1>
      <p>Welcome to the Beefree SDK React Demo</p>
      <button onClick={handleSave}>Save</button>
      <input id="debug_chk" type="checkbox" checked={debug} onChange={e => setDebug(e.target.checked)} />
      <label htmlFor="debug_chk">Debug</label>
      <div id="email-builder">
        <EmailBuilder
          ref={builderRef}
          config={config}
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
