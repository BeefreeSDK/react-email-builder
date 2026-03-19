import { render, waitFor } from '@testing-library/react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, IEntityContentJson, IToken } from '@beefree.io/sdk/dist/types/bee'
import Builder from '../Builder'
import { setConfigInRegistry } from '../hooks/useRegistry'

describe('Builder Component', () => {
  const mockToken: IToken = {
    access_token: 'test-token',
    v2: true,
  }

  const config: IBeeConfig = { container: 'test-container', uid: 'test-uid' }
  const mockTemplate: IEntityContentJson = {
    comments: {},
    page: {
      body: {
        type: '',
        webFonts: [],
        container: {
          style: {
            'background-color': '',
          },
        },
        content: {
          style: {
            'font-family': '',
            'color': '',
          },
          computedStyle: {
            align: '',
            linkColor: '',
            messageBackgroundColor: '',
            messageWidth: '',
          },
        },
      },
      description: '',
      rows: [],
      template: {
        name: '',
        type: '',
        version: '',
      },
      title: 'a title',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    setConfigInRegistry('test-container', config)
  })

  it('renders container div with default height and width', () => {
    const { container } = render(
      <Builder id={config.container} token={mockToken} template={mockTemplate} />,
    )

    const div = container.querySelector('#test-container')
    expect(div?.getAttribute('style')).toContain('height: 100%')
    expect(div?.getAttribute('style')).toContain('width: 100%')
  })

  it('renders container div with custom height and width', () => {
    const { container } = render(
      <Builder id={config.container} token={mockToken} template={mockTemplate} height="600px" width="80%" />,
    )

    const div = container.querySelector('#test-container')
    expect(div?.getAttribute('style')).toContain('height: 600px')
    expect(div?.getAttribute('style')).toContain('width: 80%')
  })

  it('passes wrapperInfo to SDK when package name and version env vars are set', () => {
    const prevName = process.env.NPM_PACKAGE_NAME
    const prevVersion = process.env.NPM_PACKAGE_VERSION
    process.env.NPM_PACKAGE_NAME = '@beefree.io/react-email-builder'
    process.env.NPM_PACKAGE_VERSION = '1.0.0'

    try {
      render(<Builder id={config.container} token={mockToken} template={mockTemplate} />)
      expect(BeefreeSDK).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          wrapperInfo: { packageName: '@beefree.io/react-email-builder', packageVersion: '1.0.0' },
        }),
      )
    } finally {
      process.env.NPM_PACKAGE_NAME = prevName
      process.env.NPM_PACKAGE_VERSION = prevVersion
    }
  })

  it('calls start when no sessionId', () => {
    const mockStart = jest.fn().mockResolvedValue(undefined);
    (BeefreeSDK as jest.Mock).mockImplementation(() => ({
      start: mockStart,
      join: jest.fn(),
      loadConfig: jest.fn(),
    }))

    render(<Builder id={config.container} token={mockToken} template={mockTemplate} />)

    expect(mockStart).toHaveBeenCalled()
  })

  it('calls join when shared and sessionId provided', () => {
    const mockJoin = jest.fn().mockResolvedValue(undefined);
    (BeefreeSDK as jest.Mock).mockImplementation(() => ({
      start: jest.fn(),
      join: mockJoin,
      loadConfig: jest.fn(),
    }))

    render(<Builder id={config.container} token={mockToken} template={mockTemplate} shared sessionId="test-session" />)

    expect(mockJoin).toHaveBeenCalledWith(
      expect.objectContaining({ container: 'test-container' }),
      'test-session',
      undefined,
    )
  })

  it('calls onError when token is missing', () => {
    const onError = jest.fn()
    // @ts-expect-error - intentionally passing undefined token to test error handling
    render(<Builder id={config.container} template={mockTemplate} token={undefined} onError={onError} />)

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('token') }),
    )
  })

  it('calls onError when SDK start fails', async () => {
    const onError = jest.fn()
    const mockStart = jest.fn().mockRejectedValue(new Error('SDK initialization failed'));
    (BeefreeSDK as jest.Mock).mockImplementation(() => ({
      start: mockStart,
      join: jest.fn(),
    }))

    render(<Builder id={config.container} token={mockToken} template={mockTemplate} onError={onError} />)

    await waitFor(() => expect(onError).toHaveBeenCalled())
  })

  it('calls onError when SDK join fails', async () => {
    const onError = jest.fn()
    const mockJoin = jest.fn().mockRejectedValue(new Error('Join session failed'));
    (BeefreeSDK as jest.Mock).mockImplementation(() => ({
      start: jest.fn(),
      join: mockJoin,
    }))

    render(
      <Builder
        id={config.container}
        token={mockToken}
        template={mockTemplate}
        shared
        sessionId="test-session"
        onError={onError}
      />,
    )

    await waitFor(() => expect(onError).toHaveBeenCalled())
  })

  it('calls onWarning when loadConfig rejects with code 3001 after editor is ready', async () => {
    const onWarning = jest.fn()
    const mockLoadConfig = jest.fn().mockRejectedValue({ code: 3001, message: 'debounced' })
    const mockStart = jest.fn().mockResolvedValue(undefined);
    (BeefreeSDK as jest.Mock).mockImplementation(() => ({
      start: mockStart,
      join: jest.fn(),
      loadConfig: mockLoadConfig,
    }))

    render(<Builder id={config.container} token={mockToken} template={mockTemplate} onWarning={onWarning} />)

    await waitFor(() => expect(onWarning).toHaveBeenCalledWith(
      expect.objectContaining({ code: 3001 }),
    ))
  })

  it('calls onError when loadConfig rejects with a generic error after editor is ready', async () => {
    const onError = jest.fn()
    const mockLoadConfig = jest.fn().mockRejectedValue(new Error('loadConfig error'))
    const mockStart = jest.fn().mockResolvedValue(undefined);
    (BeefreeSDK as jest.Mock).mockImplementation(() => ({
      start: mockStart,
      join: jest.fn(),
      loadConfig: mockLoadConfig,
    }))

    render(<Builder id={config.container} token={mockToken} template={mockTemplate} onError={onError} />)

    await waitFor(() => expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ code: 1000, message: expect.stringContaining('loadConfig error') }),
    ))
  })

  it('calls onError when uid is missing from config', () => {
    const onError = jest.fn()
    // 'no-uid-container' has no registry entry, so config.uid will be undefined
    render(<Builder id="no-uid-container" token={mockToken} template={mockTemplate} onError={onError} />)

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('uid') }),
    )
  })

  it('clears container content on unmount', async () => {
    const mockStart = jest.fn().mockResolvedValue(undefined);
    (BeefreeSDK as jest.Mock).mockImplementation(() => ({
      start: mockStart,
      join: jest.fn(),
    }))

    // Create a persistent container outside React's control
    const externalContainer = document.createElement('div')
    externalContainer.id = 'test-container'
    document.body.appendChild(externalContainer)
    externalContainer.innerHTML = '<iframe>SDK Content</iframe>'

    const { unmount } = render(<Builder id={config.container} token={mockToken} template={mockTemplate} />)

    await waitFor(() => expect(mockStart).toHaveBeenCalled())

    unmount()

    // Verify the cleanup cleared the container content
    expect(externalContainer.innerHTML).toBe('')

    // Cleanup
    document.body.removeChild(externalContainer)
  })
})
