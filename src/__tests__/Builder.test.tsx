import { render, waitFor } from '@testing-library/react'
import BeefreeSDK from '@beefree.io/sdk'
import { IEntityContentJson, IToken, TokenStatus } from '@beefree.io/sdk/dist/types/bee'
import Builder from '../Builder'
import { setConfigInstanceInRegistry } from '../hooks/useRegistry'

describe('Builder Component', () => {
  const mockToken: IToken = {
    access_token: 'test-token',
    coediting_session_id: 'session-id',
    shared: false,
    status: TokenStatus.OK,
    v2: true,
  }
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
    setConfigInstanceInRegistry('test-container', { container: 'test-container', uid: 'test-uid' })
  })

  it('renders container div with default height and width', () => {
    const { container } = render(
      <Builder id="test-container" token={mockToken} template={mockTemplate} />,
    )

    const div = container.querySelector('#test-container')
    expect(div?.getAttribute('style')).toContain('height: 100%')
    expect(div?.getAttribute('style')).toContain('width: 100%')
  })

  it('renders container div with custom height and width', () => {
    const { container } = render(
      <Builder id="test-container" token={mockToken} template={mockTemplate} height="600px" width="80%" />,
    )

    const div = container.querySelector('#test-container')
    expect(div?.getAttribute('style')).toContain('height: 600px')
    expect(div?.getAttribute('style')).toContain('width: 80%')
  })

  it('calls start when no sessionId', () => {
    const mockStart = jest.fn().mockResolvedValue(undefined);
    (BeefreeSDK as jest.Mock).mockImplementation(() => ({
      start: mockStart,
      join: jest.fn(),
      loadConfig: jest.fn(),
    }))

    render(<Builder id="test-container" token={mockToken} template={mockTemplate} />)

    expect(mockStart).toHaveBeenCalled()
  })

  it('calls join when shared and sessionId provided', () => {
    const mockJoin = jest.fn().mockResolvedValue(undefined);
    (BeefreeSDK as jest.Mock).mockImplementation(() => ({
      start: jest.fn(),
      join: mockJoin,
      loadConfig: jest.fn(),
    }))

    render(<Builder id="test-container" token={mockToken} template={mockTemplate} shared sessionId="test-session" />)

    expect(mockJoin).toHaveBeenCalledWith(
      expect.objectContaining({ container: 'test-container' }),
      'test-session',
    )
  })

  it('does not call loadConfig on initial load', async () => {
    const mockLoadConfig = jest.fn()
    const mockStart = jest.fn().mockResolvedValue(undefined);
    (BeefreeSDK as jest.Mock).mockImplementation(() => ({
      start: mockStart,
      loadConfig: mockLoadConfig,
    }))

    render(<Builder id="test-container" token={mockToken} template={mockTemplate} />)

    await waitFor(() => expect(mockStart).toHaveBeenCalled())
    expect(mockLoadConfig).not.toHaveBeenCalled()
  })

  it('calls loadConfig after config registry update', async () => {
    const mockLoadConfig = jest.fn()
    const mockStart = jest.fn().mockResolvedValue(undefined);
    (BeefreeSDK as jest.Mock).mockImplementation(() => ({
      start: mockStart,
      loadConfig: mockLoadConfig,
    }))

    const { rerender } = render(<Builder id="test-container" token={mockToken} template={mockTemplate} />)

    await waitFor(() => expect(mockStart).toHaveBeenCalled())

    setConfigInstanceInRegistry('test-container', { container: 'test-container', uid: 'test-uid', username: 'Updated' })
    rerender(<Builder id="test-container" token={mockToken} template={mockTemplate} />)

    await waitFor(() => expect(mockLoadConfig).toHaveBeenCalled())
  })
})
