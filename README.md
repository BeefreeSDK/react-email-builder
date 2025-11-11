# Beefree SDK React Component

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
npm install @beefree.io/sdk-react
# or
yarn add @beefree.io/sdk-react
```

## Quick Start

```tsx
import React, { useState, useEffect } from 'react'
import EmailBuilder from '@beefree.io/sdk-react'
import { IToken } from '@beefree.io/sdk/dist/types/bee'

function App() {
  const [token, setToken] = useState<IToken | null>(null)

  useEffect(() => {
    // Fetch token from YOUR backend server
    fetchTokenFromBackend().then(setToken)
  }, [])

  if (!token) return <div>Loading...</div>

  return (
    <EmailBuilder
      token={token}
      config={{
        uid: 'unique-user-id',
        container: 'bee-container',
      }}
      template={{
        data: {
          json: {},
          version: 0,
        },
      }}
    />
  )
}
```

## API Reference

### `EmailBuilder` Component

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `token` | `IToken` | Yes | Authentication token from Beefree API |
| `config` | `IBeeConfig` | Yes | Beefree SDK configuration object |
| `template` | `ITemplateJson` | Yes | Initial template/content to load |
| `shared` | `boolean` | No | Enable collaborative editing session |
| `sessionId` | `string` | No | Session ID to join (for collaborative editing) |
| `width` | `React.CSSProperties['width']` | No | Container width (default: '100%') |
| `height` | `React.CSSProperties['height']` | No | Container height (default: '800px') |
| `onError` | `(error: Error) => void` | No | Error callback handler |
| `onSessionStarted` | `(data: { sessionId: string }) => void` | No | Callback when collaborative session starts |

#### Basic Configuration

```tsx
<EmailBuilder
  token={token}
  config={{
    uid: 'user-123',
    container: 'bee-container',

    // Hooks
    onSave: (jsonFile, htmlFile) => {
      console.log('Saved:', { jsonFile, htmlFile })
    },

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
  }}
  template={{
    data: {
      json: {},
      version: 0
    }
  }}
/>
```

## Hooks

### `useBuilder`

Access builder instance methods to programmatically control the builder.

```tsx
import { useBuilder } from '@beefree.io/sdk-react'

function MyComponent() {
  const { save, load, saveAsTemplate, loadConfig } = useBuilder('bee-container')

  const handleSave = async () => {
    const result = await save()
    console.log('Saved:', result)
  }

  const handleLoad = async () => {
    await load(newTemplate)
  }

  return (
    <div>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleLoad}>Load New Template</button>
    </div>
  )
}
```

#### Hook Methods

- `save()` - Save current content and get JSON/HTML
- `load(template)` - Load a new template
- `saveAsTemplate()` - Save current content as a template
- `loadConfig(config)` - Update builder configuration

**Note:** Pass the same `container` ID to `useBuilder()` as specified in your `config.container` prop, or use the default if not specified.

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
<EmailBuilder config={{ container: 'builder-1' }} {...props} />
<EmailBuilder config={{ container: 'builder-2' }} {...props} />
```

### 🔄 Collaborative Editing

For collaborative sessions, share the `sessionId` between users:

```tsx
function CollaborativeEditor() {
  const [sessionId, setSessionId] = useState<string | null>(null)

  return (
    <>
      {/* Host creates the session */}
      <EmailBuilder
        shared={true}
        onSessionStarted={({ sessionId }) => setSessionId(sessionId)}
        {...otherProps}
      />

      {/* Guest joins with sessionId */}
      {sessionId && (
        <EmailBuilder
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
npm install
npm run dev
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Run tests
npm test

# Build library
npm run build
```

### Project Structure

```
src/
├── email.tsx           # Main EmailBuilder component
├── index.ts            # Public exports
├── constants.ts        # Configuration constants
├── hooks/
│   ├── useBuilder.ts   # Hook for programmatic control
│   └── useRegistry.ts  # Internal instance registry
└── __tests__/          # Test files
```

### Building

```bash
npm run build
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

### TypeScript errors

Make sure you have the SDK types installed:

```bash
npm install @beefree.io/sdk
```

### Hook not working

Ensure the `container` ID passed to `useBuilder()` matches the one in your config:

```tsx
const config = { container: 'my-builder' }
const builder = useBuilder('my-builder') // Must match!
```

## License

[MIT License](LICENSE)

## Support

For issues related to:
- **This React wrapper**: Open an issue on this repository
- **Beefree SDK**: Visit [Beefree Developer Documentation](https://docs.beefree.io/)
- **Account/billing**: Contact [Beefree Support](https://www.beefree.io/support/)

## Resources

- [Beefree SDK Documentation](https://docs.beefree.io/)
- [Beefree API Reference](https://docs.beefree.io/api-reference)
- [Examples and Guides](https://github.com/BEE-Plugin/sdk-examples)
