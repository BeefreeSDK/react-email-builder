import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IToken, Builder, IBeeConfig } from '../dist/index.es'
import { Controls } from './Controls'

const names = ['pippo', 'pluto', 'paperino', 'topolino', 'minnie', 'qui', 'quo', 'qua']

const getToken = async (uid?: string) => {
  /**
   * ************************************************************
   *                      !!!! WARNING !!!!                     *
   *                                                            *
   *  This is done on the frontend to get the example working.  *
   *  You must set up a backend server to perform the login.    *
   *  Otherwise, your credentials will be at risk!              *
   *                                                            *
   * ************************************************************
   */
  const AUTH_URL = 'https://pre-bee-auth.getbee.info/loginV2'

  const response = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.SDK_CLIENT_ID,
      client_secret: process.env.SDK_CLIENT_SECRET,
      uid: uid || 'demo-user',
    }),
  })
  return response.json()
}

export const App = () => {
  const [users, setUsers] = useState<string[]>([names[0]])
  const [savedRows, setSavedRows] = useState([])
  const [token, setToken] = useState<IToken>()
  const [isShared, setIsShared] = useState<boolean>(false)
  const [isEditorStarted, setIsEditorStarted] = useState<boolean>(true)
  const [sessionId, setSessionId] = useState<string | null>(null)

  console.log(`%csf: App - App ->`, `color:${'#00ff00'}`, { sessionId })

  useEffect(() => {
    getToken().then(token => setToken(token))
  }, [])

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

  const onSave2 = useCallback((...args) => {
    console.log(`%c[APP] - onSave BIS ->`, `color:${'#00ff00'}`, args)
  }, [])

  const config: IBeeConfig = useMemo(() => {
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
          label: 'addOns',
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
      onSave: (...args) => {
        console.log(`%c[APP] - onSave ->`, `color:${'#00ff00'}`, args)
      },
      onChange: (...args) => {
        console.log(`%c[APP] - onChange ->`, `color:${'#aaf7ff'}`, args)
      },
      onRemoteChange: (...args) => {
        console.log(`%c[APP] - onRemoteChange ->`, `color:${'#fff7aa'}`, args)
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
      username: 'Tester',
    })
  }, [getMentionsHandler, getRowsHandler, saveRowHandler, errorHandler, warningHandler])

  return (
    <>
      <h1>Beefree SDK React Demo</h1>
      <p>Welcome to the Beefree SDK React Demo</p>
      <button onClick={handleUsers}>Update users</button>
      <input id="shared_chk" type="checkbox" checked={isShared} onChange={e => setIsShared(e.target.checked)} />
      <label htmlFor="shared_chk">Shared session</label>
      <button onClick={() => setIsEditorStarted(wasShared => !wasShared)}>Toggle builder</button>
      <div id="email-builder">
        { token && isEditorStarted
          ? (
              <>
                <Controls />
                <Builder
                  config={config}
                  template={{}}
                  shared={isShared}
                  onSessionStarted={({ sessionId }) => setSessionId(sessionId)}
                  token={token}
                />
                {sessionId && (
                  <>
                    <Controls id="bis" />
                    <Builder
                      config={{ ...config, container: 'bis', id: 'bis', userHandle: 'bis', onSave: () => console.log(`this won't trigger`) }}
                      shared={isShared}
                      sessionId={sessionId}
                      token={token}
                      onSave={onSave2}
                    />
                  </>
                )}
              </>
            )
          : <></>}
      </div>
    </>
  )
}
