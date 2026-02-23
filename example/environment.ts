export const environment = {
  production: false,
  emailBuilder: {
    clientId: process.env.EMAIL_BUILDER_CLIENT_ID ?? '',
    clientSecret: process.env.EMAIL_BUILDER_CLIENT_SECRET ?? '',
    userId: process.env.EMAIL_BUILDER_USER_ID || 'your-user-id',
    templateUrl: 'https://rsrc.getbee.io/api/templates/m-bee',
  },
  pageBuilder: {
    clientId: process.env.PAGE_BUILDER_CLIENT_ID ?? '',
    clientSecret: process.env.PAGE_BUILDER_CLIENT_SECRET ?? '',
    userId: process.env.PAGE_BUILDER_USER_ID || 'your-user-id',
    templateUrl: 'https://raw.githubusercontent.com/BeefreeSDK/beefree-sdk-assets-templates/main/v3/bee-templates/blank.json',
  },
  popupBuilder: {
    clientId: process.env.POPUP_BUILDER_CLIENT_ID ?? '',
    clientSecret: process.env.POPUP_BUILDER_CLIENT_SECRET ?? '',
    userId: process.env.POPUP_BUILDER_USER_ID || 'your-user-id',
    templateUrl: 'https://raw.githubusercontent.com/BeefreeSDK/beefree-sdk-assets-templates/main/v3/bee-templates/blank.json',
  },
  fileManager: {
    clientId: process.env.FILE_MANAGER_CLIENT_ID ?? '',
    clientSecret: process.env.FILE_MANAGER_CLIENT_SECRET ?? '',
    userId: process.env.FILE_MANAGER_USER_ID || 'your-user-id',
    templateUrl: 'https://raw.githubusercontent.com/BeefreeSDK/beefree-sdk-assets-templates/main/v3/bee-templates/blank.json',
  },
}
