import { useCallback, useEffect, useState } from 'react'
import { Controls } from './Controls'
import { mockTemplate } from './mockTemplate'
import { BeePluginError, Builder, IBeeConfig, ILanguage, IPluginRow, IToken, useBuilder } from '../dist/index'

interface ISaveRowResult {
  name: string

  [key: string]: unknown
}

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
  const AUTH_URL = 'https://bee-auth.getbee.io/loginV2'

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

const config: IBeeConfig = {
  logLevel: 0,
  container: 'test',
  username: 'Tester',
  uid: 'demo-user',
  userHandle: 'test',
  userColor: '#fff',
  saveRows: true,
  templateLanguage: {
    label: 'English (US)',
    value: 'en-US',
  },
  templateLanguages: [
    { value: 'it-IT', label: 'Italiano' },
  ],
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
}

const config1 = ({ ...config })
const config2 = {
  ...config,
  username: 'User 2',
  container: 'bis',
  userColor: '#000',
  userHandle: 'bis',
}

export const App = () => {
  const [users, setUsers] = useState<string[]>([names[0]])
  const [savedRows, setSavedRows] = useState<IPluginRow[]>([])
  const [token, setToken] = useState<IToken>()
  const [isShared, setIsShared] = useState<boolean>(false)
  const [isEditorStarted, setIsEditorStarted] = useState<boolean>(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [ready, setReady] = useState<boolean>(false)

  const {
    id,
    updateConfig,
    save,
    saveAsTemplate,
    switchTemplateLanguage,
    togglePreview,
    updateToken,
  } = useBuilder(config1)
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
      default:
        reject()
    }
  }, [savedRows])

  const saveRowHandler = useCallback(async (resolve: (result: ISaveRowResult) => void) => {
    console.log(`%c[APP] - saveRow handler ->`, `color:${'#00ff00'}`)
    resolve({ name: 'row from config update' })
  }, [])

  const sendInviteHandler = useCallback((_resolve: unknown, _reject: unknown, args: unknown) => {
    console.log(`%c[APP] - sendInvite handler ->`, `color:${'#00ff00'}`, args)
  }, [])

  useEffect(() => {
    getToken().then(token => setToken(token))
  }, [])

  useEffect(() => {
    if (ready) {
      void updateConfig({
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
            handler: async (resolve: (content: Record<string, unknown>) => void) => {
              resolve({ type: 'image', value: { alt: '', dynamicSrc: '', href: '', src: '' } })
            },
          },
          saveRow: {
            label: 'Save',
            handler: saveRowHandler,
          },
          getMention: {
            label: 'Send an invite',
            handler: sendInviteHandler,
          },
        },
      })
    }
  }, [ready, updateConfig, getRowsHandler, saveRowHandler, sendInviteHandler, getMentionsHandler])

  const loaderUrl = 'https://bee-loader.getbee.io/v2/api/loader'

  const refreshToken = useCallback(async () => {
    const updatedToken = await getToken()
    setToken(updatedToken)
  }, [])

  useEffect(() => {
    if (token) updateToken(token)
  }, [updateToken, token])

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
                {ready && (
                  <Controls
                    id={config.container}
                    save={save}
                    saveAsTemplate={saveAsTemplate}
                    updateConfig={updateConfig}
                    switchTemplateLanguage={switchTemplateLanguage}
                    togglePreview={togglePreview}
                  />
                )}
                <Builder
                  id={config.container}
                  template={mockTemplate}
                  shared={isShared}
                  onSessionStarted={({ sessionId }: { sessionId: string }) => setSessionId(sessionId)}
                  token={token}
                  onSave={(args: unknown) => {
                    console.log(`%c[APP] - onSave Builder 1 ->`, `color:${'#00ff00'}`, args)
                  }}
                  onChange={(args: unknown) => {
                    console.log(`%c[APP] - onChange Builder 1 ->`, `color:${'#aaf7ff'}`, args)
                    console.log(`%csf: App - ->`, `color:${'#00ff00'}`, { users })
                  }}
                  onRemoteChange={(args: unknown) => {
                    console.log(`%c[APP] - onRemoteChange Builder 1 ->`, `color:${'#fff7aa'}`, args)
                  }}
                  onSaveRow={(savedRow: string): void => {
                    console.log(`%c[APP] - onSaveRow Builder 1 ->`, `color:${'#00ff00'}`, savedRow)
                    setSavedRows((prevRows: IPluginRow[]) => [...prevRows, JSON.parse(savedRow)])
                  }}
                  onError={(error: BeePluginError) => {
                    console.log(`%c[APP] - onError Builder 1 ->`, `color:${'#ff0000'}`, error)
                    if (error?.code === 5101) {
                      void refreshToken()
                    }
                  }}
                  onWarning={(warning: BeePluginError) => {
                    console.log(`%c[APP] - onWarning Builder 1 ->`, `color:${'#fbda00'}`, warning)
                  }}
                  onLoad={() => {
                    console.log(`%c[APP] - builder is ready ->`, `color:${'#00ff00'}`)
                    setReady(true)
                  }}
                  height="800px"
                  loaderUrl={loaderUrl}
                  onTemplateLanguageChange={(language: ILanguage) => {
                    console.log(`%c[APP] - onTemplateLanguageChange ->`, `color:${'#ff00ff'}`, language)
                  }}
                />
                {sessionId && (
                  <>
                    <Controls
                      id={config2.container}
                      save={builder2.save}
                      saveAsTemplate={builder2.saveAsTemplate}
                      updateConfig={builder2.updateConfig}
                      switchTemplateLanguage={builder2.switchTemplateLanguage}
                    />
                    <Builder
                      id={id}
                      template={mockTemplate}
                      shared={isShared}
                      sessionId={sessionId}
                      token={token}
                      onSave={(args: unknown) => {
                        console.log(`%c[APP] - onSave Builder 2 ->`, `color:${'#00ff00'}`, args)
                      }}
                      onChange={(args: unknown) => {
                        console.log(`%c[APP] - onChange Builder 2 ->`, `color:${'#aaf7ff'}`, args)
                      }}
                      onRemoteChange={(args: unknown) => {
                        console.log(`%c[APP] - onRemoteChange Builder 2 ->`, `color:${'#fff7aa'}`, args)
                      }}
                      onSaveRow={(savedRow: string) => {
                        console.log(`%c[APP] - onSaveRow Builder 2 ->`, `color:${'#00ff00'}`, savedRow)
                        setSavedRows((prevRows: IPluginRow[]) => [...prevRows, JSON.parse(savedRow)])
                      }}
                      onError={(error: BeePluginError) => {
                        console.log(`%c[APP] - onError Builder 2 ->`, `color:${'#ff0000'}`, error)
                      }}
                      onWarning={(warning: BeePluginError) => {
                        console.log(`%c[APP] - onWarning Builder 2 ->`, `color:${'#fbda00'}`, warning)
                      }}
                      height="800px"
                      loaderUrl={loaderUrl}
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
