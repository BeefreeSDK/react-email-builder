import React from 'react'
import { createRoot } from 'react-dom/client'

const App = () => {
  return (
    <div>
      <h1>Beefree SDK React Demo</h1>
      <p>Welcome to the Beefree SDK React Demo</p>
    </div>
  )
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
