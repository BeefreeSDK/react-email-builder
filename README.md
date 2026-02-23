# Beefree SDK React Component

[![npm version](https://badge.fury.io/js/%40beefree.io%2Freact-email-builder.svg)](https://www.npmjs.com/package/@beefree.io/react-email-builder)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![CI](https://github.com/BeefreeSDK/npm-react/workflows/CI/badge.svg)](https://github.com/BeefreeSDK/npm-react/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue)](https://react.dev/)

A React wrapper component for the [Beefree SDK](https://www.beefree.io/), making it easy to integrate the Beefree email/page builder into your React applications.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Hooks](#hooks)
- [Best Practices](#best-practices)
- [Advanced Usage](#advanced-usage)
- [Examples](#examples)
- [Development](#development)
- [License](#license)

## Overview

This library provides a React component wrapper for the Beefree SDK, allowing you to easily embed the Beefree email and landing page builder into your React applications. It handles the SDK initialization, lifecycle management, and provides React-friendly APIs including hooks for programmatic control.

### Features

- 🎯 **Simple React Integration** - Drop-in component with minimal setup
- 🪝 **React Hooks Support** - `useBuilder` hook for programmatic control
- 🔄 **Dynamic Configuration** - Update builder configuration on the fly
- 👥 **Collaborative Editing** - Support for shared/collaborative sessions
- 📦 **TypeScript Support** - Full TypeScript definitions included
- 🎨 **Customizable** - Full access to Beefree SDK configuration options

## Installation

```bash
npm install @beefree.io/react-email-builder
# or
yarn add @beefree.io/react-email-builder
```

## Quick Start

```tsx
import React, { useState, useEffect } from 'react'
import { Builder, IToken, useBuilder } from '@beefree.io/react-email-builder'

function App() {
  const [token, setToken] = useState<IToken | null>(null)

  useBuilder({
    container: 'bee-container',
    // ... other config options
  })

  useEffect(() => {
    // Fetch token from YOUR backend server
    fetchTokenFromBackend().then(setToken)
  }, [])

  if (!token) return <div>Loading...</div>

  return (
    <Builder
      id="bee-container"
      token={token}
      template={{
        comments: {},
        page: {},
      }}
    />
  )
}
```

## API Reference

### `Builder` Component

#### Props

| Prop               | Type                                   | Required | Description                                                  |
|--------------------|----------------------------------------|----------|--------------------------------------------------------------|
| `id`               | `string`                               | Yes | The container ID (must match the `container` from `useBuilder`) |
| `token`            | `IToken`                               | Yes | Authentication token from Beefree API                        |
| `template`         | `IEntityContentJson`                   | Yes | Initial template/content to load                             |
| `shared`           | `boolean`                              | No | Enable collaborative editing session                         |
| `sessionId`        | `string`                               | No | Session ID to join (for collaborative editing)               |
| `width`            | `React.CSSProperties['width']`         | No | Container width (default: '100%')                            |
| `height`           | `React.CSSProperties['height']`        | No | Container height (default: '800px')                          |
| `loaderUrl`        | `string`                               | No | Custom loader URL for the Beefree SDK                        |
| `onLoad`           | `() => void`                           | No | Callback when builder is fully loaded and ready              |
| `onSave`           | `(json, html) => void`                 | No | Callback when content is saved                               |
| `onChange`         | `(json, metadata) => void`             | No | Callback when content changes                                |
| `onError`          | `(error: BeePluginError) => void`      | No | Error callback handler                                       |
| `onWarning`        | `(warning: BeePluginError) => void`    | No | Warning callback handler                                     |
| `onSaveRow`        | `(row: string) => void`                | No | Callback when a row is saved                                 |
| `onRemoteChange`   | `(data) => void`                       | No | Callback for collaborative editing remote changes            |
| `onSessionStarted` | `(data: { sessionId: string }) => void` | No | Callback when collaborative session starts                   |
| `onTemplateLanguageChange` | `(language) => void`           | No | Callback when template language changes                      |

#### Basic Configuration

```tsx
useBuilder({
  uid: 'user-123',
  container: 'bee-container',

  // Customization
  language: 'en-US',
  specialLinks: [
    { type: 'unsubscribe', label: 'Unsubscribe', link: '[unsubscribe]' }
  ],

  // Content management
  contentDialog: {
    saveRow: {
      label: 'Save Row',
      handler: (resolve) => resolve({ name: 'My Row' })
    }
  }
})

return (
  <Builder
    token={token}
    template={{
      comments: {},
      page: {},
    }}
    onSave={(jsonFile, htmlFile) => {
      console.log('Saved:', {jsonFile, htmlFile})
    }}
  />
)
```

## Hooks

### `useBuilder`

The `useBuilder` hook provides programmatic control over the builder instance and allows you to dynamically update configuration properties (non-callback properties like `uid`, `language`, etc.).

```tsx
import { Builder, useBuilder } from '@beefree.io/react-email-builder'

function MyComponent() {
  // Initialize useBuilder with config including container ID
  const initialConfig = {
    container: 'bee-editor', // This is the ID that links hook and component
    uid: 'user-123',
    language: 'en-US',
    // ...more configs
  }

  const { updateConfig, load, save, saveAsTemplate } = useBuilder(initialConfig)

  // Update configuration dynamically
  const changeLanguage = (lang: string) => {
    updateConfig({ language: lang })
  }

  const changeUser = (userId: string) => {
    updateConfig({ uid: userId })
  }

  const handleSave = async () => {
    const result = await save()
    console.log('Saved:', result)
  }

  return (
    <div>
      <button onClick={() => changeLanguage('it-IT')}>Switch to Italian</button>
      <button onClick={() => changeUser('user-456')}>Change User</button>
      <button onClick={handleSave}>Save</button>

      <Builder
        id="bee-editor"
        token={token}
        template={template}
        // Define callbacks directly in the component
        onSave={(json, html) => {
          console.log('Content saved:', json, html)
        }}
        onChange={(json, metadata) => {
          console.log('Content changed')
        }}
        onLoad={() => {
          console.log('Builder is ready!')
        }}
      />
    </div>
  )
}
```

## Best Practices

### 🔒 Security: Server-Side Token Generation

**⚠️ CRITICAL:** Never expose your Beefree API credentials in frontend code!

**❌ Bad (Insecure):**

```tsx
// DON'T DO THIS!
const token = await fetch('https://auth.beefree.io/token', {
  method: 'POST',
  body: JSON.stringify({
    client_id: 'your-client-id',      // ❌ Exposed!
    client_secret: 'your-secret',      // ❌ Exposed!
  })
})
```

**✅ Good (Secure):**

1. **Backend API endpoint** (Node.js/Express example):

```javascript
// backend/routes/auth.js
app.post('/api/beefree/token', async (req, res) => {
  const response = await fetch('https://auth.beefree.io/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.BEEFREE_CLIENT_ID,
      client_secret: process.env.BEEFREE_CLIENT_SECRET,
      uid: req.user.id // Your user's ID
    })
  })

  const token = await response.json()
  res.json(token)
})
```

2. **Frontend:**

```tsx
// frontend/App.tsx
const fetchToken = async () => {
  const response = await fetch('/api/beefree/token', {
    credentials: 'include' // Include session cookies
  })
  return response.json()
}
```

### 📝 Configuration Management

Keep your configuration in `useMemo` to prevent unnecessary re-renders:

```tsx
const config = useMemo(() => ({
  uid: user.id,
  container: 'bee-container',
  onSave: handleSave,
  // ... other config
}), [user.id, handleSave])
```

### 🎯 Unique Container IDs

When using multiple builders on the same page, ensure unique `container` IDs:

```tsx
const config1 = useBuilder({ container: 'builder-1', ...otherProperties })
const config2 = useBuilder({ container: 'builder-2', ...otherProperties})
```

### 🔄 Collaborative Editing

For collaborative sessions, share the `sessionId` between users:

```tsx
function CollaborativeEditor() {
  const [sessionId, setSessionId] = useState<string | null>(null)

  return (
    <>
      {/* Host creates the session */}
      <Builder
        shared={true}
        onSessionStarted={({ sessionId }) => setSessionId(sessionId)}
        {...otherProps}
      />

      {/* Guest joins with sessionId */}
      {sessionId && (
        <Builder
          shared={true}
          sessionId={sessionId}
          {...otherProps}
        />
      )}
    </>
  )
}
```

## Advanced Usage

### Custom Content Dialogs

```tsx
const config = {
  contentDialog: {
    saveRow: {
      label: 'Save to Library',
      handler: async (resolve) => {
        // Show your custom UI, then resolve
        const rowName = await showCustomDialog()
        resolve({ name: rowName })
      }
    },
    addOn: {
      handler: async (resolve) => {
        const content = await fetchCustomContent()
        resolve(content)
      }
    }
  }
}
```

### External Content Sources

```tsx
const config = {
  rowsConfiguration: {
    externalContentURLs: [
      {
        name: 'My Saved Rows',
        handle: 'saved-rows',
        isLocal: true
      }
    ]
  },
  hooks: {
    getRows: {
      handler: async (resolve, reject, args) => {
        if (args.handle === 'saved-rows') {
          const rows = await fetchSavedRows()
          resolve(rows)
        } else {
          reject('Handle not found')
        }
      }
    }
  }
}
```

### Mentions/Merge Tags

```tsx
const config = {
  hooks: {
    getMentions: {
      handler: async (resolve) => {
        const mentions = [
          { username: 'FirstName', value: '{{firstName}}', uid: 'fn' },
          { username: 'LastName', value: '{{lastName}}', uid: 'ln' }
        ]
        resolve(mentions)
      }
    }
  }
}
```

## Examples

Check the `/example` directory for a complete working example including:

- Token authentication flow
- Collaborative editing
- Custom content dialogs
- Save/load functionality
- Hook usage

To run the example:

```bash
yarn install
yarn start
```

The development server will start at `http://localhost:3000`

## Development

### Setup

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Run tests
yarn test
```

### Building

```bash
yarn build
```

Outputs:
- `dist/index.js` - CommonJS bundle
- `dist/index.es.js` - ES module bundle
- `dist/index.d.ts` - TypeScript definitions

## Troubleshooting

### Builder not loading

1. Verify token is valid and not expired
2. Check console for errors
3. Ensure `container` ID is unique on the page

## License

[Apache-2.0 License](LICENSE)

## Support

For issues related to:
- **This React wrapper**: Open an issue on this repository
- **Beefree SDK**: Visit [Beefree Developer Documentation](https://docs.beefree.io/)
- **Account/billing**: Contact [Beefree Support](https://www.beefree.io/support/)

## Resources

- [Beefree SDK Documentation](https://docs.beefree.io/)
- [Beefree API Reference](https://docs.beefree.io/beefree-sdk/apis)
- [Examples and Guides](https://github.com/BeefreeSDK/beefree-sdk-examples)
