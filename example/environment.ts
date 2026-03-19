interface BuilderConfig {
  clientId: string
  clientSecret: string
  userId: string
  sampleTemplateUrl: string
  blankTemplateUrl: string
}

interface Environment {
  production: boolean
  emailBuilder: BuilderConfig
  pageBuilder: BuilderConfig
  popupBuilder: BuilderConfig
  fileManager: BuilderConfig
}

export const environment: Environment = {
  production: false,
  emailBuilder: {
    clientId: process.env.EMAIL_BUILDER_CLIENT_ID ?? '',
    clientSecret: process.env.EMAIL_BUILDER_CLIENT_SECRET ?? '',
    userId: process.env.EMAIL_BUILDER_USER_ID || 'your-user-id',
    sampleTemplateUrl: 'https://rsrc.getbee.io/api/templates/m-bee',
    blankTemplateUrl: '/templates/blank-template.json',
  },
  pageBuilder: {
    clientId: process.env.PAGE_BUILDER_CLIENT_ID ?? '',
    clientSecret: process.env.PAGE_BUILDER_CLIENT_SECRET ?? '',
    userId: process.env.PAGE_BUILDER_USER_ID || 'your-user-id',
    sampleTemplateUrl: 'https://rsrc.getbee.io/api/templates/m-bee-page',
    blankTemplateUrl: '/templates/blank-template.json',
  },
  popupBuilder: {
    clientId: process.env.POPUP_BUILDER_CLIENT_ID ?? '',
    clientSecret: process.env.POPUP_BUILDER_CLIENT_SECRET ?? '',
    userId: process.env.POPUP_BUILDER_USER_ID || 'your-user-id',
    sampleTemplateUrl: 'https://rsrc.getbee.io/api/templates/m-bee-popup',
    blankTemplateUrl: '/templates/blank-template.json',
  },
  fileManager: {
    clientId: process.env.FILE_MANAGER_CLIENT_ID ?? '',
    clientSecret: process.env.FILE_MANAGER_CLIENT_SECRET ?? '',
    userId: process.env.FILE_MANAGER_USER_ID || 'your-user-id',
    sampleTemplateUrl: '',
    blankTemplateUrl: '/templates/blank-template.json',
  },
}
