import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BeePluginError,
  Builder,
  IBeeConfig,
  IEntityContentJson,
  IToken,
  useBuilder,
} from '../dist/index'
import { getBuilderToken } from './beefree-token'
import { environment } from './environment'
import i18nEnUS from './i18n/en-US.json'
import i18nItIT from './i18n/it-IT.json'
import i18nEsES from './i18n/es-ES.json'
import i18nFrFR from './i18n/fr-FR.json'
import i18nDeDE from './i18n/de-DE.json'
import i18nPtBR from './i18n/pt-BR.json'
import i18nIdID from './i18n/id-ID.json'
import i18nJaJP from './i18n/ja-JP.json'
import i18nZhCN from './i18n/zh-CN.json'
import i18nZhHK from './i18n/zh-HK.json'
import i18nCsCZ from './i18n/cs-CZ.json'
import i18nNbNO from './i18n/nb-NO.json'
import i18nDaDK from './i18n/da-DK.json'
import i18nSvSE from './i18n/sv-SE.json'
import i18nPlPL from './i18n/pl-PL.json'
import i18nHuHU from './i18n/hu-HU.json'
import i18nRuRU from './i18n/ru-RU.json'
import i18nKoKR from './i18n/ko-KR.json'
import i18nNlNL from './i18n/nl-NL.json'
import i18nFiFI from './i18n/fi-FI.json'
import i18nRoRO from './i18n/ro-RO.json'
import i18nSlSI from './i18n/sl-SI.json'
import type { ToastType } from './App'

export type BuilderType = 'emailBuilder' | 'pageBuilder' | 'popupBuilder' | 'fileManager'

interface BeefreeExampleProps {
  builderType: BuilderType
  builderLanguage: string
  isShared: boolean
  onIsSharedChange: (shared: boolean) => void
  onNotify: (message: string, type?: ToastType, title?: string, durationMs?: number) => void
}

const BLANK_TEMPLATE: IEntityContentJson = {
  comments: {},
  page: {} as unknown as IEntityContentJson['page'],
}

const I18N_MAP: Record<string, typeof i18nEnUS> = {
  'en-US': i18nEnUS,
  'it-IT': i18nItIT,
  'es-ES': i18nEsES,
  'fr-FR': i18nFrFR,
  'de-DE': i18nDeDE,
  'pt-BR': i18nPtBR,
  'id-ID': i18nIdID,
  'ja-JP': i18nJaJP,
  'zh-CN': i18nZhCN,
  'zh-HK': i18nZhHK,
  'cs-CZ': i18nCsCZ,
  'nb-NO': i18nNbNO,
  'da-DK': i18nDaDK,
  'sv-SE': i18nSvSE,
  'pl-PL': i18nPlPL,
  'hu-HU': i18nHuHU,
  'ru-RU': i18nRuRU,
  'ko-KR': i18nKoKR,
  'nl-NL': i18nNlNL,
  'fi-FI': i18nFiFI,
  'ro-RO': i18nRoRO,
  'sl-SI': i18nSlSI,
}

function interpolate(
  template: string,
  values: Record<string, React.ReactNode>,
): React.ReactNode[] {
  return template.split(/\{(\w+)\}/).map((segment, i) =>
    i % 2 === 0 ? segment : (values[segment] ?? `{${segment}}`),
  ).filter(segment => segment !== '')
}

function isAuthError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const msg = error.message
  return /^Authentication failed: [45]\d{2}\b/.test(msg)
    || msg.startsWith('Invalid credentials:')
}

export const BeefreeExample = ({
  builderType,
  builderLanguage,
  isShared,
  onIsSharedChange,
  onNotify,
}: BeefreeExampleProps) => {
  const [token, setToken] = useState<IToken | null>(null)
  const [isLoadingToken, setIsLoadingToken] = useState(true)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [credentialsError, setCredentialsError] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [loadedTemplate, setLoadedTemplate] = useState<'sample' | 'blank' | null>(null)

  const [sessionId, setSessionId] = useState<string | null>(null)
  const [secondToken, setSecondToken] = useState<IToken | null>(null)
  const [splitPosition, setSplitPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [builderKey, setBuilderKey] = useState(0)
  const [activeTemplate, setActiveTemplate] = useState<IEntityContentJson>(BLANK_TEMPLATE)
  const [isRestarting, setIsRestarting] = useState(false)

  const buildersAreaRef = useRef<HTMLDivElement>(null)
  const isFirstMountRef = useRef(true)
  const isSharedRef = useRef(isShared)
  const prevIsSharedRef = useRef(isShared)
  const builderTypeRef = useRef(builderType)
  const getTemplateJsonRef = useRef<typeof getTemplateJson>(null!)

  useEffect(() => {
    isSharedRef.current = isShared
  }, [isShared])
  useEffect(() => {
    builderTypeRef.current = builderType
  }, [builderType])

  const clientConfig = useMemo<IBeeConfig>(() => ({
    uid: 'demo-user',
    container: 'beefree-sdk-builder',
    language: 'en-US',
    username: 'User 1',
    userColor: '#00aced',
    userHandle: 'user1',
  }), [])

  const coEditingConfig = useMemo<IBeeConfig>(() => ({
    uid: 'demo-user-2',
    container: 'beefree-sdk-builder-2',
    language: 'en-US',
    username: 'User 2',
    userColor: '#000000',
    userHandle: 'user2',
  }), [])

  const {
    id: primaryId,
    updateConfig,
    preview,
    save,
    saveAsTemplate,
    load,
    getTemplateJson,
  } = useBuilder(clientConfig)

  const {
    id: coEditingId,
    updateConfig: coEditingUpdateConfig,
    preview: coEditingPreview,
    save: coEditingSave,
    saveAsTemplate: coEditingSaveAsTemplate,
    load: coEditingLoad,
  } = useBuilder(coEditingConfig)

  useEffect(() => {
    getTemplateJsonRef.current = getTemplateJson
  }, [getTemplateJson])

  const builderReady = !!token && !credentialsError && !tokenError && !isLoadingToken

  const i18nMessages = useMemo(
    () => I18N_MAP[builderLanguage] ?? i18nEnUS,
    [builderLanguage],
  )

  const i18nStrings = useMemo(
    () => i18nMessages.credentials,
    [i18nMessages],
  )

  const exampleStrings = useMemo(
    () => i18nMessages.example,
    [i18nMessages],
  )

  const i18nDescription = useMemo(
    () => interpolate(i18nStrings.description, {
      type: <strong>{builderType}</strong>,
      clientId: <code>*_CLIENT_ID</code>,
      clientSecret: <code>*_CLIENT_SECRET</code>,
      envFile: <code>.env</code>,
    }),
    [i18nStrings, builderType],
  )

  // ---- Token management ----

  const loadBeefreeToken = useCallback(async (bt: BuilderType) => {
    try {
      setIsLoadingToken(true)
      setTokenError(null)
      setCredentialsError(false)

      const newToken = await getBuilderToken(
        environment[bt].clientId,
        environment[bt].clientSecret,
        environment[bt].userId,
      )

      setToken(newToken)
    } catch (error) {
      console.error('Failed to load Beefree token:', error)
      if (isAuthError(error)) {
        setCredentialsError(true)
      } else {
        setTokenError(`Failed to load ${bt}. Please try again.`)
      }
    } finally {
      setIsLoadingToken(false)
    }
  }, [])

  const refreshToken = useCallback(() => {
    void loadBeefreeToken(builderTypeRef.current)
  }, [loadBeefreeToken])

  const fetchSecondToken = useCallback(async () => {
    try {
      const bt = builderTypeRef.current
      const newToken = await getBuilderToken(
        environment[bt].clientId,
        environment[bt].clientSecret,
        'demo-user-2',
      )
      setSecondToken(newToken)
    } catch (error) {
      console.error('Failed to get second token:', error)
    }
  }, [])

  // ---- Co-editing ----

  const stopCoEditing = useCallback(() => {
    onIsSharedChange(false)
  }, [onIsSharedChange])

  // ---- Builder actions ----

  const downloadFile = useCallback((filename: string, content: string, contentType = 'application/json') => {
    const blob = new Blob([content], { type: contentType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const handleBuilderSave = useCallback((_pageJson: string, pageHtml: string) => {
    downloadFile(`design-${Date.now()}.html`, pageHtml, 'text/html;charset=utf-8')
  }, [downloadFile])

  const handleBuilderSaveAsTemplate = useCallback((pageJson: string) => {
    const parsed = typeof pageJson === 'string' ? JSON.parse(pageJson) : pageJson
    const content = JSON.stringify(parsed, null, 2)
    downloadFile(`template-${Date.now()}.json`, content, 'application/json')
  }, [downloadFile])

  const handleLoadSampleTemplate = useCallback(async (loadFn: (t: IEntityContentJson) => void) => {
    try {
      setIsExecuting(true)
      const bt = builderTypeRef.current
      const url = environment[bt].sampleTemplateUrl

      if (!url) {
        loadFn({} as IEntityContentJson)
        setLoadedTemplate('sample')
        return
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.status} ${response.statusText}`)
      }
      const json: IEntityContentJson = await response.json()
      const template = (json as unknown as { json: IEntityContentJson }).json ?? json

      loadFn(template)
      setLoadedTemplate('sample')
    } catch (error) {
      console.error('Load template failed:', error)
      onNotify(error instanceof Error ? error.message : 'Unknown error', 'error', 'Load failed')
    } finally {
      setIsExecuting(false)
    }
  }, [onNotify])

  const handleLoadBlankTemplate = useCallback(async (loadFn: (t: IEntityContentJson) => void) => {
    try {
      setIsExecuting(true)
      const bt = builderTypeRef.current
      const response = await fetch(environment[bt].blankTemplateUrl)
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.status} ${response.statusText}`)
      }
      const json: IEntityContentJson = await response.json()

      loadFn(json)
      setLoadedTemplate('blank')
    } catch (error) {
      console.error('Load template failed:', error)
      onNotify(error instanceof Error ? error.message : 'Unknown error', 'error', 'Load failed')
    } finally {
      setIsExecuting(false)
    }
  }, [onNotify])

  const handleLoadTemplateButton = useCallback((loadFn: (t: IEntityContentJson) => void) => {
    if (loadedTemplate === 'sample') {
      void handleLoadBlankTemplate(loadFn)
    } else {
      void handleLoadSampleTemplate(loadFn)
    }
  }, [loadedTemplate, handleLoadSampleTemplate, handleLoadBlankTemplate])

  const loadTemplateButtonLabel = loadedTemplate === 'sample'
    ? exampleStrings.loadBlankTemplate
    : exampleStrings.loadSampleTemplate

  // ---- Draggable split divider ----

  const SPLIT_STEP = 2
  const SPLIT_MIN = 25
  const SPLIT_MAX = 75

  const onMouseMove = useCallback((e: MouseEvent) => {
    const area = buildersAreaRef.current
    if (!area) return
    const rect = area.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    setSplitPosition(Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, pct)))
  }, [])

  const onMouseUp = useCallback(() => {
    setIsDragging(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }, [onMouseMove])

  const onDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [onMouseMove, onMouseUp])

  const onDividerKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      const delta = e.key === 'ArrowLeft' ? -SPLIT_STEP : SPLIT_STEP
      setSplitPosition(pos => Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, pos + delta)))
    }
  }, [])

  // ---- Effects ----

  // Co-editing toggled: capture template, then restart via two-phase approach
  useEffect(() => {
    const prev = prevIsSharedRef.current
    prevIsSharedRef.current = isShared

    if (prev === isShared) return

    if (!isShared) {
      setSessionId(null)
      setSecondToken(null)
    }

    let cancelled = false

    const captureAndRestart = async () => {
      try {
        const result = await getTemplateJsonRef.current()
        if (cancelled) return
        const template = (result as { data?: { json?: IEntityContentJson } })?.data?.json
        if (template) setActiveTemplate(template)
      } catch {
        // capture failed, activeTemplate keeps its current value
      }
      if (!cancelled) {
        setIsRestarting(true)
      }
    }

    void captureAndRestart()

    return () => {
      cancelled = true
    }
  }, [isShared])

  // Two-phase restart: builders are unmounted while isRestarting is true,
  // giving the SDK time to clean up before new instances are created
  useEffect(() => {
    if (!isRestarting) return
    const timer = setTimeout(() => {
      setBuilderKey(k => k + 1)
      setIsRestarting(false)
    }, 0)
    return () => clearTimeout(timer)
  }, [isRestarting])

  // Builder type change (also handles initial load on mount)
  useEffect(() => {
    if (!isFirstMountRef.current) {
      if (isSharedRef.current) {
        onIsSharedChange(false)
      } else {
        setBuilderKey(k => k + 1)
      }
    }
    setActiveTemplate(BLANK_TEMPLATE)
    setLoadedTemplate(null)
    void loadBeefreeToken(builderType).then(() => {
      isFirstMountRef.current = false
    })
  }, [builderType, loadBeefreeToken, onIsSharedChange])

  // Builder language change
  useEffect(() => {
    if (!builderReady) return
    void updateConfig({ language: builderLanguage })
    if (isSharedRef.current) {
      void coEditingUpdateConfig({ language: builderLanguage })
    }
  }, [builderLanguage, builderReady, updateConfig, coEditingUpdateConfig])

  // Drag event cleanup
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  // ---- Builder callbacks ----

  const handleSessionStarted = useCallback((event: { sessionId?: string }) => {
    if (event?.sessionId) {
      setSessionId(event.sessionId)
      void fetchSecondToken()
    }
  }, [fetchSecondToken])

  const handleBuilderError = useCallback((error: BeePluginError) => {
    console.error('Beefree error:', error)
    const msg = error.message || JSON.stringify(error)
    if (isSharedRef.current && /co-editing/i.test(msg)) {
      onNotify(exampleStrings.coEditingPlanError, 'error')
      stopCoEditing()
    } else {
      onNotify(msg, 'error', exampleStrings.error)
    }
  }, [stopCoEditing, onNotify, exampleStrings])

  // ---- Render helpers ----

  const buttonsDisabled = !builderReady || isExecuting

  const renderCommandBar = (
    previewFn: typeof preview,
    saveFn: typeof save,
    saveAsTemplateFn: typeof saveAsTemplate,
    loadFn: typeof load,
  ) => (
    <div className="command-bar">
      <button disabled={buttonsDisabled} onClick={() => previewFn()}>{exampleStrings.preview}</button>
      <button disabled={buttonsDisabled} onClick={() => saveFn()}>{exampleStrings.save}</button>
      <button disabled={buttonsDisabled} onClick={() => saveAsTemplateFn()}>{exampleStrings.saveAsTemplate}</button>
      {!isShared && (
        <button disabled={buttonsDisabled} onClick={() => handleLoadTemplateButton(loadFn)}>{loadTemplateButtonLabel}</button>
      )}
    </div>
  )

  // ---- Render ----

  return (
    <div className="beefree-example">
      {credentialsError
        ? (
            <div className="credentials-notice">
              <h2>{i18nStrings.title}</h2>
              <p>{i18nDescription}</p>
              <ol>
                <li>
                  <a href="https://developers.beefree.io/console" target="_blank" rel="noopener noreferrer">
                    {i18nStrings.step1}
                  </a>
                </li>
                <li>{i18nStrings.step2}</li>
                <li>{i18nStrings.step3}</li>
              </ol>
              <p>
                {i18nStrings.docs}
                {' '}
                <a href="https://docs.beefree.io/get-started" target="_blank" rel="noopener noreferrer">
                  {i18nStrings.gettingStartedGuide}
                </a>
                .
              </p>
              <button onClick={refreshToken}>{i18nStrings.retry}</button>
            </div>
          )
        : isLoadingToken
          ? (
              <div className="loading">
                {exampleStrings.loading.replace('{type}', builderType)}
              </div>
            )
          : tokenError
            ? (
                <div className="error">
                  <p>{tokenError}</p>
                  <button onClick={refreshToken}>{exampleStrings.retry}</button>
                </div>
              )
            : token && !isRestarting
              ? (
                  <div
                    className={`builders-area${isShared ? ' co-editing' : ''}`}
                    ref={buildersAreaRef}
                  >
                    <div
                      className={`builder-panel${isDragging ? ' dragging' : ''}`}
                      style={{ width: isShared ? `${splitPosition}%` : '100%' }}
                    >
                      {renderCommandBar(preview, save, saveAsTemplate, load)}
                      <div className="builder-container">
                        <Builder
                          key={`primary-${builderKey}`}
                          id={primaryId}
                          template={activeTemplate}
                          token={token}
                          shared={isShared}
                          onSave={handleBuilderSave}
                          onSaveAsTemplate={handleBuilderSaveAsTemplate}
                          onSend={(htmlFile: string) => {
                            console.log('onSend called:', htmlFile)
                            onNotify(exampleStrings.checkConsole, 'success', exampleStrings.templateSent)
                          }}
                          onError={handleBuilderError}
                          onSessionStarted={handleSessionStarted}
                          onWarning={(warning: BeePluginError) => {
                            console.warn('Beefree warning:', warning)
                          }}
                          onLoad={() => {
                            console.log('Builder is ready')
                          }}
                        />
                      </div>
                    </div>

                    {isShared && (
                      <>
                        <div
                          className={`split-divider${isDragging ? ' dragging' : ''}`}
                          role="separator"
                          aria-orientation="vertical"
                          aria-valuenow={Math.round(splitPosition)}
                          aria-valuemin={SPLIT_MIN}
                          aria-valuemax={SPLIT_MAX}
                          aria-label={exampleStrings.resizePanels}
                          tabIndex={0}
                          onMouseDown={onDividerMouseDown}
                          onKeyDown={onDividerKeyDown}
                        >
                          <div className="split-divider-handle" />
                        </div>
                        <div
                          className={`builder-panel${isDragging ? ' dragging' : ''}`}
                          style={{ width: `${100 - splitPosition}%` }}
                        >
                          {renderCommandBar(
                            coEditingPreview,
                            coEditingSave,
                            coEditingSaveAsTemplate,
                            coEditingLoad,
                          )}
                          <div className="builder-container">
                            {secondToken && sessionId
                              ? (
                                  <Builder
                                    key={`co-editing-${builderKey}`}
                                    id={coEditingId}
                                    template={BLANK_TEMPLATE}
                                    token={secondToken}
                                    shared
                                    sessionId={sessionId}
                                    onSave={handleBuilderSave}
                                    onSaveAsTemplate={handleBuilderSaveAsTemplate}
                                    onSend={(htmlFile: string) => {
                                      console.log('Co-editing onSend called:', htmlFile)
                                      onNotify(exampleStrings.checkConsole, 'success', exampleStrings.templateSent)
                                    }}
                                    onError={handleBuilderError}
                                    onWarning={(warning: BeePluginError) => {
                                      console.warn('Co-editing warning:', warning)
                                    }}
                                  />
                                )
                              : (
                                  <div className="loading">{exampleStrings.joiningSession}</div>
                                )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )
              : null}
    </div>
  )
}
