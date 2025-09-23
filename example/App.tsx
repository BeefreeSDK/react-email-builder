import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controls } from './Controls'
import EmailBuilder from '../dist/index.es'
import { IToken } from '@beefree.io/sdk/dist/types/bee'
import { BEE_AUTH_URL } from '../src/constants'

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
  const response = await fetch(BEE_AUTH_URL, {
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
      <div id="email-builder">
        <Controls />
        { token
          ? (
              <EmailBuilder
                config={config}
                template={{
                  data: {
                    json: {},
                    version: 0,
                  },
                }}
                token={token}
              />
            )
          : <></>}
      </div>
    </>
  )
}
