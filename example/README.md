# Beefree SDK React Example

A fully working example application that demonstrates how to integrate the Beefree SDK into a React application using the `@beefree.io/react-email-builder` package.

<!-- TODO: Replace with an actual screenshot -->
<!-- ![Example App Screenshot](docs/example-screenshot.png) -->

## What you can try

- **Switch builder types** — Email Builder, Page Builder, Popup Builder, and File Manager
- **Collaborative editing** — Toggle co-editing to see two builder instances sharing a real-time session
- **Template preservation** — Your template edits carry over when toggling co-editing on and off
- **Export** — Save, preview, and export templates as JSON or HTML
- **Multi-language UI** — Switch the builder's interface language from the header dropdown

## Prerequisites

- **Node.js** >= 18
- **Yarn** (this repo uses Yarn 4)
- **Beefree SDK credentials** — sign up for free at [developers.beefree.io](https://developers.beefree.io)

## Quick start

From the repository root:

```bash
# 1. Install dependencies
yarn install

# 2. Create your .env file (only EMAIL_BUILDER credentials are required to get started)
cp .env.sample .env
# Edit .env and fill in your EMAIL_BUILDER_CLIENT_ID and EMAIL_BUILDER_CLIENT_SECRET

# 3. Start the development server
yarn start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```
example/
├── App.tsx              # Application shell, header, language selector
├── BeefreeExample.tsx   # Main builder integration (tokens, co-editing, commands)
├── beefree-token.ts     # Token fetching helper
├── environment.ts       # Builder type configuration (client IDs, secrets)
├── index.html           # HTML entry point
├── index.tsx            # React DOM root
├── style.css            # Application styles
├── assets/              # Logo and favicon
└── i18n/                # UI translations (22 languages)
```

## Notes

- This example fetches tokens directly from the Beefree auth API for simplicity. **In production, always generate tokens from your backend** to keep your `client_secret` secure. See the [Security section](../README.md#-security-server-side-token-generation) in the main README.
- The example supports all four builder types, but you only need credentials for the ones you want to test. Selecting a builder type without valid credentials will show a clear error message.
