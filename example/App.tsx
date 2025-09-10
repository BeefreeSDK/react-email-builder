import React, { useCallback, useMemo, useRef, useState } from 'react'
import EmailBuilder, { useBuilder } from '../dist/index.es'
import BeefreeSDK from '@beefree.io/sdk'

const names = ['pippo', 'pluto', 'paperino', 'topolino', 'minnie', 'qui', 'quo', 'qua']

export const App = () => {
  const builderRef = useRef<BeefreeSDK>(null)
  const [users, setUsers] = useState<string[]>([names[0]])
  const [debug, setDebug] = useState<boolean>(false)
  const [savedRows, setSavedRows] = useState([])
  const { save: saveHtml } = useBuilder(builderRef)
  const handleSave = () => {
    saveHtml()
  }

  const handleUsers = () => {
    if (users.length < names.length) setUsers(prevUsers => [...prevUsers, names[prevUsers.length]])
  }

  const getMentionsHandler = useCallback(async (resolve) => {
    resolve(users.map(user => ({
      userColor: '#ff0000',
      username: user,
      value: user,
      uid: user,
    })),
    )
  }, [users])

  const getRowsHandler = useCallback(async (resolve, reject, args) => {
    const { handle } = args
    switch (handle) {
      case 'saved-rows':
        resolve(savedRows)
        break
      case 'custom-rows':
        resolve([{ name: 'One button', columns: [{ weight: 12, modules: [{ type: 'button' }] }] }])
        break
      default:
        reject(`${handle} not handled`)
    }
  }, [savedRows])

  const onSaveRowHandler = (savedRow) => {
    console.log(`%c[APP] - onSaveRow ->`, `color:${'#00ff00'}`, savedRow)
    setSavedRows(prevRows => [...prevRows, JSON.parse(savedRow)])
  }

  const saveRowHandler = useCallback(async (resolve) => {
    resolve({ name: 'row' })
  }, [])

  const errorHandler = useCallback((error) => {
    console.log(`%c[APP] - onError ->`, `color:${'#ff0000'}`, error)
  }, [])

  const warningHandler = useCallback((warning) => {
    console.log(`%c[APP] - onWarning ->`, `color:${'#fbda00'}`, warning)
  }, [])

  const config = useMemo(() => {
    console.log(`%c[APP] - config ->`, `color:${'#a100ff'}`, 'config object re-created')
    return ({
      id: 'test',
      hooks: {
        getMentions: {
          handler: getMentionsHandler,
        },
        getRows: {
          handler: getRowsHandler,
        },
      },
      contentDialog: {
        addOn: {
          // FIXME: purposely made it to be recreated at every render to test the new loader
          handler: (resolve) => {
            resolve({ type: 'button', value: { text: 'Button' } })
          },
        },
        saveRow: {
          label: 'Save',
          handler: saveRowHandler,
        },
      },
      debug: {
        all: debug,
      },
      onSaveRow: onSaveRowHandler,
      onError: errorHandler,
      onWarning: warningHandler,
      rowsConfiguration: {
        emptyRows: true,
        defaultRows: true,
        externalContentURLs: [
          {
            name: 'Saved rows',
            handle: 'saved-rows',
            isLocal: true,
          },
          {
            name: 'Custom rows',
            handle: 'custom-rows',
            isLocal: true,
            behaviors: {
              canEdit: false,
              canDelete: false,
            },
          },
        ],
      },
    })
  }, [getMentionsHandler, getRowsHandler, saveRowHandler, debug, errorHandler, warningHandler])

  return (
    <>
      <h1>Beefree SDK React Demo</h1>
      <p>Welcome to the Beefree SDK React Demo</p>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleUsers}>Update users</button>
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
