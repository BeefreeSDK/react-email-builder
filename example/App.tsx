import { useCallback, useEffect, useRef, useState } from 'react'
import { BeefreeExample } from './BeefreeExample'
import type { BuilderType } from './BeefreeExample'

const UI_LANGUAGES = [
  'en-US', 'it-IT', 'es-ES', 'fr-FR', 'de-DE', 'pt-BR',
  'id-ID', 'ja-JP', 'zh-CN', 'zh-HK', 'cs-CZ', 'nb-NO',
  'da-DK', 'sv-SE', 'pl-PL', 'hu-HU', 'ru-RU', 'ko-KR',
  'nl-NL', 'fi-FI', 'ro-RO', 'sl-SI',
]

const REACT_LOGO_DATA_URI = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-11.5 -10.232 23 20.463'%3e%3ccircle r='2.05' fill='white'/%3e%3cg stroke='white' fill='none'%3e%3cellipse rx='11' ry='4.2'/%3e%3cellipse rx='11' ry='4.2' transform='rotate(60)'/%3e%3cellipse rx='11' ry='4.2' transform='rotate(120)'/%3e%3c/g%3e%3c/svg%3e"

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
      showToast('Your React Beefree SDK app is up and running.', 'success', 'Congratulations!')
    }, 500)
    return () => {
      clearTimeout(timer)
      clearToastTimers()
    }
  }, [showToast, clearToastTimers])

  return (
    <main className="main">
      <header>
        <div className="left-side">
          <img src="assets/logo.svg" height="40" alt="Beefree SDK" />
        </div>
        <div className="right-side">
          <div className="header-controls">
            <div className="header-select-group">
              <label htmlFor="headerBuilderType">Builder:</label>
              <select
                id="headerBuilderType"
                value={selectedBuilderType}
                onChange={(e) => setSelectedBuilderType(e.target.value as BuilderType)}
              >
                <option value="emailBuilder">Email Builder</option>
                <option value="pageBuilder">Page Builder</option>
                <option value="popupBuilder">Popup Builder</option>
                <option value="fileManager">File Manager</option>
              </select>
            </div>
            <div className="header-select-group">
              <label htmlFor="headerLanguage">Language:</label>
              <select
                id="headerLanguage"
                value={selectedBuilderLanguage}
                onChange={(e) => setSelectedBuilderLanguage(e.target.value)}
              >
                {UI_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <button
              className={`header-coediting-btn${isShared ? ' active' : ''}`}
              onClick={() => setIsShared((s) => !s)}
            >
              Co-editing
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
