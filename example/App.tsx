import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BeefreeExample } from './BeefreeExample'
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

import type { BuilderType } from './BeefreeExample'

const UI_LANGUAGES = [
  'en-US', 'it-IT', 'es-ES', 'fr-FR', 'de-DE', 'pt-BR',
  'id-ID', 'ja-JP', 'zh-CN', 'zh-HK', 'cs-CZ', 'nb-NO',
  'da-DK', 'sv-SE', 'pl-PL', 'hu-HU', 'ru-RU', 'ko-KR',
  'nl-NL', 'fi-FI', 'ro-RO', 'sl-SI',
]

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

const REACT_LOGO_DATA_URI = 'data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'-11.5 -10.232 23 20.463\'%3e%3ccircle r=\'2.05\' fill=\'white\'/%3e%3cg stroke=\'white\' fill=\'none\'%3e%3cellipse rx=\'11\' ry=\'4.2\'/%3e%3cellipse rx=\'11\' ry=\'4.2\' transform=\'rotate(60)\'/%3e%3cellipse rx=\'11\' ry=\'4.2\' transform=\'rotate(120)\'/%3e%3c/g%3e%3c/svg%3e'

export type ToastType = 'success' | 'error' | 'info'

interface ToastState {
  message: string
  title?: string
  type: ToastType
}

export const App = () => {
  const [selectedBuilderType, setSelectedBuilderType] = useState<BuilderType>('emailBuilder')
  const [selectedBuilderLanguage, setSelectedBuilderLanguage] = useState('en-US')
  const [isShared, setIsShared] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [toastExiting, setToastExiting] = useState(false)
  const toastTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  const appStrings = useMemo(() => {
    const messages = I18N_MAP[selectedBuilderLanguage] ?? i18nEnUS
    return { ...messages.app, builderTypes: messages.app.builderTypes as Record<string, string> }
  }, [selectedBuilderLanguage])
  const clearToastTimers = useCallback(() => {
    toastTimers.current.forEach(clearTimeout)
    toastTimers.current = []
  }, [])

  const showToast = useCallback((message: string, type: ToastType = 'info', title?: string, durationMs = 5000) => {
    clearToastTimers()
    setToastExiting(false)
    setToast({ message, type, title })

    toastTimers.current.push(
      setTimeout(() => setToastExiting(true), durationMs),
      setTimeout(() => {
        setToast(null)
        setToastExiting(false)
      }, durationMs + 400),
    )
  }, [clearToastTimers])

  useEffect(() => {
    const timer = setTimeout(() => {
      showToast(appStrings.welcomeMessage, 'success', appStrings.welcomeTitle)
    }, 500)
    return () => {
      clearTimeout(timer)
      clearToastTimers()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="main">
      <header>
        <div className="left-side">
          <img src="assets/logo.svg" height="40" alt="Beefree SDK" />
        </div>
        <div className="right-side">
          <div className="header-controls">
            <div className="header-select-group">
              <label htmlFor="headerBuilderType">{appStrings.builderLabel}</label>
              <select
                id="headerBuilderType"
                value={selectedBuilderType}
                onChange={e => setSelectedBuilderType(e.target.value as BuilderType)}
              >
                <option value="emailBuilder">{appStrings.builderTypes.emailBuilder}</option>
                <option value="pageBuilder">{appStrings.builderTypes.pageBuilder}</option>
                <option value="popupBuilder">{appStrings.builderTypes.popupBuilder}</option>
                <option value="fileManager">{appStrings.builderTypes.fileManager}</option>
              </select>
            </div>
            <div className="header-select-group">
              <label htmlFor="headerLanguage">{appStrings.languageLabel}</label>
              <select
                id="headerLanguage"
                value={selectedBuilderLanguage}
                onChange={e => setSelectedBuilderLanguage(e.target.value)}
              >
                {UI_LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <button
              className={`header-coediting-btn${isShared ? ' active' : ''}`}
              onClick={() => setIsShared(s => !s)}
              disabled={selectedBuilderType === 'fileManager'}
            >
              {appStrings.coEditing}
            </button>
          </div>
          <div className="react-brand">
            <img src={REACT_LOGO_DATA_URI} alt="React" />
            <span>React</span>
          </div>
        </div>
      </header>
      <div className="content">
        <BeefreeExample
          builderType={selectedBuilderType}
          builderLanguage={selectedBuilderLanguage}
          isShared={isShared}
          onIsSharedChange={setIsShared}
          onNotify={showToast}
        />
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}${toastExiting ? ' toast-exit' : ''}`}>
          {toast.title && <h3>{toast.title}</h3>}
          <p>{toast.message}</p>
        </div>
      )}
    </main>
  )
}
