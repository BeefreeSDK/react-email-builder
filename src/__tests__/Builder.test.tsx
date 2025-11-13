import { render } from '@testing-library/react'
import Builder from '../Builder'
import { IBeeConfig, IToken } from '@beefree.io/sdk/dist/types/bee'

describe('Builder Component', () => {
  const mockToken = 'test-token' as unknown as IToken
  const mockTemplate = { data: {} } as any
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
})
