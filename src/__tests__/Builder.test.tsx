import { render } from '@testing-library/react'
import Builder from '../Builder'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, ITemplateJson, IToken } from '@beefree.io/sdk/dist/types/bee'
import { DEFAULT_ID } from '../constants'

describe('Builder Component', () => {
  const mockToken = 'test-token' as unknown as IToken
  const mockTemplate: ITemplateJson = {
    data: {
      json: {
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
                color: '',
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
      },
      version: 0
    }
  }
  const mockConfig: IBeeConfig = {
    uid: 'test-uid',
    container: 'test-container',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders container div with default height and width', () => {
    const { container } = render(
      <Builder config={mockConfig} token={mockToken} template={mockTemplate} />
    )

    const div = container.querySelector('#test-container')
    expect(div?.getAttribute('style')).toContain('height: 800px')
    expect(div?.getAttribute('style')).toContain('width: 100%')
  })

  it('renders container div with custom height and width', () => {
    const { container } = render(
      <Builder config={mockConfig} token={mockToken} template={mockTemplate} height="600px" width="80%" />
    )

    const div = container.querySelector('#test-container')
    expect(div?.getAttribute('style')).toContain('height: 600px')
    expect(div?.getAttribute('style')).toContain('width: 80%')
  })

  it('uses default container id when not provided', () => {
    const { container } = render(
      <Builder config={{ uid: 'test-uid' } as any} token={mockToken} template={mockTemplate} />
    )

    expect(container.querySelector(`#${DEFAULT_ID}`)).toBeTruthy()
  })

  it('calls start when no sessionId', () => {
    const mockStart = jest.fn().mockResolvedValue(undefined);
    (BeefreeSDK as jest.Mock).mockImplementation(() => ({
      start: mockStart,
      join: jest.fn(),
      loadConfig: jest.fn(),
    }))

    render(<Builder config={mockConfig} token={mockToken} template={mockTemplate} />)

    expect(mockStart).toHaveBeenCalled()
  })

  it('calls join when shared and sessionId provided', () => {
    const mockJoin = jest.fn().mockResolvedValue(undefined);
    (BeefreeSDK as jest.Mock).mockImplementation(() => ({
      start: jest.fn(),
      join: mockJoin,
      loadConfig: jest.fn(),
    }))

    render(<Builder config={mockConfig} token={mockToken} template={mockTemplate} shared sessionId="test-session" />)

    expect(mockJoin).toHaveBeenCalledWith(
      expect.objectContaining({ container: 'test-container' }),
      'test-session'
    )
  })

  it('throws error when no token provided', () => {
    expect(() => {
      render(<Builder config={mockConfig} token={null as any} template={mockTemplate} />)
    }).toThrow("Can't start the builder without a token")
  })
})
