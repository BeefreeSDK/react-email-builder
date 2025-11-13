jest.mock('@beefree.io/sdk', () => {
  const mockInstance = {
    start: jest.fn().mockResolvedValue(undefined),
    join: jest.fn().mockResolvedValue(undefined),
    loadConfig: jest.fn(),
  }
  return {
    __esModule: true,
    default: jest.fn(() => mockInstance),
  }
})
