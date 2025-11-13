import EmailBuilder from '../Builder'

describe('email', () => {
  it('Should return true for valid email', () => {
    expect(EmailBuilder({
      config: {
        container: 'test-container',
        uid: 'test',
      }, template: {
        data: {
          json: undefined,
          version: 0,
        },
      },
    })).toMatchSnapshot()
  })
})
