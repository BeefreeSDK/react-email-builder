import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { BeePluginError, IPluginRow, IToken } from '@beefree.io/sdk/dist/types/bee'
import { Builder, IBeeConfig, useBuilder } from '../src/index'
import { Controls } from './Controls'
import { mockTemplate } from './mockTemplate'

const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah']

interface IMention {
  userColor: string
  username: string
  value: string
  uid: string
}

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
  const [savedRows, setSavedRows] = useState<any>([])
  const [token, setToken] = useState<IToken>()
  const [isShared, setIsShared] = useState<boolean>(false)
  const [isEditorStarted, setIsEditorStarted] = useState<boolean>(true)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const config: IBeeConfig = useMemo(() => {
    console.log(`%c[APP] - config ->`, `color:${'#a100ff'}`, 'config object re-created')
    return ({
      container: 'test',
      username: 'Tester',
      uid: 'demo-user',
      userHandle: 'test',
      userColor: '#fff',
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
  }, [])

  console.log(`%csf: App - App ->`, `color:${'#00ff00'}`, { sessionId })

  const config1 = useMemo(() => ({ ...config }), [config])
  const config2 = useMemo(() => {
    const result = {
      ...config,
      username: 'User 2',
      container: 'bis',
      userColor: '#000',
      userHandle: 'bis',
    }
    console.log('[APP] config2 created:', result.username, result.userHandle, result.userColor, result.container)
    return result
  }, [config])

  const { updateConfig, save, saveAsTemplate, switchTemplateLanguage } = useBuilder(config1)
  const builder2 = useBuilder(config2)

  const handleUsers = () => {
    if (users.length < names.length) setUsers(prevUsers => [...prevUsers, names[prevUsers.length]])
  }

  const getMentionsHandler = useCallback(async (
    resolve: (mentions: IMention[]) => void,
  ) => {
    resolve(users.map(user => ({
      userColor: '#ff0000',
      username: user,
      value: user,
      uid: user,
    })))
  }, [users])

  const getRowsHandler = useCallback(async (
    resolve: (data: IPluginRow[], options?: Record<string, unknown> | undefined) => void,
    reject: () => void,
    args: {
      handle: string
      value: string
    },
  ) => {
    const { handle } = args
    switch (handle) {
      case 'saved-rows':
        resolve(savedRows)
        break
      case 'custom-rows':
        resolve([{
          name: 'One button',
          container: {} as any,
          content: {},
          type: 'four-columns-empty',
          uuid: crypto.randomUUID(),
          columns: [{
            'grid-columns': 12,
            'style': {} as any,
            'uuid': crypto.randomUUID(),
            'modules': [{ type: 'button', descriptor: {} as any, locked: false, uuid: crypto.randomUUID() }],
          }],
        }])
        break
      default:
        reject()
    }
  }, [savedRows])

  const onSaveRowHandler = (savedRow: string): void => {
    console.log(`%c[APP] - onSaveRow ->`, `color:${'#00ff00'}`, savedRow)
    setSavedRows((prevRows: string[]) => [...prevRows, JSON.parse(savedRow)])
  }

  const onSaveRowHandlerBis = (savedRow: string) => {
    console.log(`%c[APP] - onSaveRow Bis ->`, `color:${'#00ff00'}`, savedRow)
    setSavedRows((prevRows: string[]) => [...prevRows, JSON.parse(savedRow)])
  }

  const saveRowHandler = useCallback(async (resolve: any) => {
    resolve({ name: 'row' })
  }, [])

  const errorHandler = useCallback((error: BeePluginError) => {
    console.log(`%c[APP] - onError ->`, `color:${'#ff0000'}`, error)
  }, [])

  const errorHandlerBis = useCallback((error: BeePluginError) => {
    console.log(`%c[APP] - onError Bis ->`, `color:${'#ff0000'}`, error)
  }, [])

  const warningHandler = useCallback((warning: BeePluginError) => {
    console.log(`%c[APP] - onWarning ->`, `color:${'#fbda00'}`, warning)
  }, [])

  const warningHandlerBis = useCallback((warning: BeePluginError) => {
    console.log(`%c[APP] - onWarning Bis ->`, `color:${'#fbda00'}`, warning)
  }, [])

  const onSave2 = useCallback((...args: any) => {
    console.log(`%c[APP] - onSave Bis ->`, `color:${'#00ff00'}`, args)
  }, [])

  useEffect(() => {
    getToken().then(token => setToken(token))
  }, [])

  useEffect(() => {
    updateConfig({
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
          handler: async (resolve) => {
            resolve({ type: 'image', value: { alt: '', dynamicSrc: '', href: '', src: '' } })
          },
        },
        saveRow: {
          label: 'Save',
          handler: saveRowHandler,
        },
      },
    })
  }, [updateConfig])

  return (
    <>
      <h1>Beefree SDK React Demo</h1>
      <p>Welcome to the Beefree SDK React Demo</p>
      <button onClick={handleUsers}>Update users</button>
      <input id="shared_chk" type="checkbox" checked={isShared} onChange={e => setIsShared(e.target.checked)} />
      <label htmlFor="shared_chk">Shared session</label>
      <button onClick={() => setIsEditorStarted(wasShared => !wasShared)}>Toggle builder</button>
      <div id="email-builder">
        {token && isEditorStarted
          ? (
              <>
                <Controls
                  id={config.container}
                  save={save}
                  saveAsTemplate={saveAsTemplate}
                  updateConfig={updateConfig}
                  switchTemplateLanguage={switchTemplateLanguage}
                />
                <Builder
                  id="test"
                  template={mockTemplate}
                  shared={isShared}
                  onSessionStarted={({ sessionId }) => setSessionId(sessionId)}
                  token={token}
                  onSave={(...args: any) => {
                    console.log(`%c[APP] - onSave ->`, `color:${'#00ff00'}`, args)
                  }}
                  onChange={(...args: any) => {
                    console.log(`%c[APP] - onChange ->`, `color:${'#aaf7ff'}`, args)
                  }}
                  onRemoteChange={(...args: any) => {
                    console.log(`%c[APP] - onRemoteChange ->`, `color:${'#fff7aa'}`, args)
                  }}
                  onSaveRow={onSaveRowHandler}
                  onError={errorHandler}
                  onWarning={warningHandler}
                  height="800px"
                  loaderUrl="https://pre-bee-loader.getbee.info/v2/api/loader"
                  onTemplateLanguageChange={(language) => {
                    console.log(`%c[APP] - onTemplateLanguageChange ->`, `color:${'#ff00ff'}`, language)
                  }}
                />
                {sessionId && (
                  <>
                    <Controls
                      id="bis"
                      save={builder2.save}
                      saveAsTemplate={builder2.saveAsTemplate}
                      updateConfig={builder2.updateConfig}
                    />
                    <Builder
                      id="bis"
                      template={mockTemplate}
                      shared={isShared}
                      sessionId={sessionId}
                      token={token}
                      onChange={(json: string) => {
                        console.log(`%c[APP] Bis - onChange ->`, `color:${'#aaf7ff'}`, json)
                      }}
                      onRemoteChange={(json: string) => {
                        console.log(`%c[APP] Bis - onRemoteChange ->`, `color:${'#fff7aa'}`, json)
                      }}
                      onSave={onSave2}
                      onSaveRow={onSaveRowHandlerBis}
                      onError={errorHandlerBis}
                      onWarning={warningHandlerBis}
                      height="800px"
                      loaderUrl="https://pre-bee-loader.getbee.info/v2/api/loader"
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
