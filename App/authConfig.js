const { LogLevel } = require("@azure/msal-node");


const msalConfig = {
    auth: {
        clientId: '6fa25587-12af-4887-a03b-253f1bfb74b3',
        authority: 'https://login.microsoftonline.com/0891528f-b789-41ef-9d10-895a44f5f624'
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: LogLevel.Verbose,
        },
    },
};

const graphConfig = {
    graphMe: {
        endpoint: 'https://graph.microsoft.com/v1.0/me',
        scopes: ['user.read']
    }
};

module.exports = {
    msalConfig: msalConfig,
    graphConfig: graphConfig
}