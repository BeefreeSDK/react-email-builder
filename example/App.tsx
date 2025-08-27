import React from 'react'
import EmailBuilder from '../dist'

export const App = () => {
  return (
    <>
      <h1>Beefree SDK React Demo</h1>
      <p>Welcome to the Beefree SDK React Demo</p>
      <div id="email-builder">
        <EmailBuilder />
      </div>
    </>
  )
}
