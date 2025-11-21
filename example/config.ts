import { IBeeConfig } from "../dist"

export const config: IBeeConfig = {
  container: 'element',
  username: 'Tester',
  uid: 'demo-user',
  rowsConfiguration: {
    emptyRows: true,
    defaultRows: true,
    externalContentURLs: [
      {
        name: 'Saved rows',
        handle: 'saved-rows',
        isLocal: true,
      },
      {
        name: 'Custom rows',
        handle: 'custom-rows',
        isLocal: true,
        behaviors: {
          canEdit: false,
          canDelete: false,
        },
      },
    ],
  },
}