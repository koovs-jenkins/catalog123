angular.module( 'app' ).constant( 'Constants', {
    APP_URL: '/',
    AUTH_TOKEN_KEY: 'X-AUTH-TOKEN',
    NODE_API_URL : "/api/",
    CONFIG_DATA_URL : "/app/data/",
    APPROVE_APP_EMAIL_URL : '/email/sendEmail',
    APP_MAIL_LINK: 'http://alphagen-api.koovs.com',
    WEB_MAIL_LINK: 'http://alphagen.koovs.com',
    FROM_EMAIL: 'support@koovs.com',
    IOS_DEEP_LINK: 'koovs',
    WIDGET_IMAGE_UPLOAD_LIMIT: 300000,
    ALLOWED_EMAIL_DOMAINS: [/^\"?[\w-_\.]*\"?@koovs\.com$/, /^\"?[\w-_\.]*\"?@fg\.com$/]
  });