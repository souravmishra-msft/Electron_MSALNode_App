const { LogLevel } = require("@azure/msal-node");

const msalConfig = {
  auth: {
    clientId: "<application-id captured from the app registration done in Entra ID>",
    authority: "https://login.microsoftonline.com/<tenant-id>",
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
    endpoint: "https://graph.microsoft.com/v1.0/me",
    scopes: ["user.read"],
  },
};

module.exports = {
  msalConfig: msalConfig,
  graphConfig: graphConfig,
};
