const { PublicClientApplication, InteractionRequiredAuthError } = require("@azure/msal-node");
const { shell } = require("electron");


class AuthProvider {
    msalConfig;
    clientApplication;
    account;
    cache;

    constructor(msalConfig) {
        this.msalConfig = msalConfig;
        this.clientApplication = new PublicClientApplication(this.msalConfig);
        this.cache = this.clientApplication.getTokenCache();
        this.account = null
    }

    async login() {
        const authResponse = await this.getToken({
            scopes: [],
        });

        return this.handleResponse(authResponse);
    }

    async logout() {
        if (!this.account)
            return;

        try {
            if (this.account.idTokenClaims.hasOwnProperty('login_hint')) {
                await shell.openExternal(`${this.msalConfig.auth.authority}/oauth2/v2.0/logout?logout_hint=${encodedURIComponent(this.account.idTokenClaims.login_hint)}`);
            }
            await this.cache.removeAccount(this.account);
            this.account = null;
        } catch (error) {
            console.log(error);
        }
    }

    async getToken(tokenRequest) {
        let authResponse;
        const account = this.account || (await this.getAccount());

        if (account) {
            tokenRequest.account = account;
            authResponse = await this.getTokenSilent(tokenRequest);
        } else {
            authResponse = await this.getTokenInteractive(tokenRequest);
        }

        return authResponse || null;
    }

    async getTokenSilent(tokenRequest) {
        try {
            return await this.clientApplication.acquireTokenSilent(tokenRequest);
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                console.log(`Silent token acquisition failed, acquiring token interactively`);
                return await this.getTokenInteractive(tokenRequest);
            }

            console.log(error);
        }
    }

    async getTokenInteractive(tokenRequest) {
        try {
            const openBrowser = async (url) => {
                await shell.openExternal(url);
            };

            const authResponse = await this.clientApplication.acquireTokenInteractive({
                ...tokenRequest,
                openBrowser,
                successTemplate: '<h1>Successfully signed in!</h1> <p>You can close this window now.</p>',
                errorTemplate: '<h1>Oops!, Something went wrong.</h1><p>Check the console for more information.</p>'
            });

            return authResponse;
        } catch (error) {
            throw error;
        }
    }

    async handleResponse(response) {
        if (response !== null)
            this.account = response.account;
        else
            this.account = await this.getAccount();

        return this.account;
    }

    async getAccount() {
        const currentAccounts = await this.cache.getAllAccounts();

        if (!currentAccounts) {
            console.log(`No accounts found!`);
            return null;
        }

        if (currentAccounts.length > 1) {
            console.log(`Multiple accounts found, need to choose the correct account.`);
            return currentAccounts[0];
        } else if (currentAccounts.length === 1) {
            return currentAccounts[0];
        } else {
            return null;
        }
    }
}

module.exports = AuthProvider;