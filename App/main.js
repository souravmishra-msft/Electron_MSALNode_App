const path = require('path');
const { BrowserWindow, app, ipcMain } = require('electron');
const AuthProvider = require('./authProvider');
const { msalConfig, graphConfig } = require('./authConfig');
const { IPC_MESSAGES } = require('./constants');
const getGraphClient = require('./graph');


let authProvider;
let mainWindow;

const createWindow = () => {
    console.log(path.join(__dirname, 'preload.js'));
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        }
    });

    authProvider = new AuthProvider(msalConfig);
}



app.on('ready', async () => {
    await createWindow();
    mainWindow.loadFile(path.join(__dirname, './index.html'));
    mainWindow.webContents.openDevTools()

});

// To set the app to exit
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length == 0) {
        createWindow();
    }
});

// Event Handlers
ipcMain.on(IPC_MESSAGES.LOGIN, async () => {
    const account = await authProvider.login();
    await mainWindow.loadFile(path.join(__dirname, '/App/index.html'));
    mainWindow.webContents.send(IPC_MESSAGES.SHOW_WELCOME_MESSAGE, account);
});

ipcMain.on(IPC_MESSAGES.LOGOUT, async () => {
    await authProvider.logout();
    await mainWindow.loadFile(path.join(__dirname, '/App/index.html'));
});

ipcMain.on(IPC_MESSAGES.GET_PROFILE, async () => {
    const tokenRequest = {
        scopes: graphConfig.graphMe.scopes,
    };

    const tokenResponse = await authProvider.getToken(tokenRequest);
    const account = authProvider.account;

    await mainWindow.loadFile(path.join(__dirname, '/App/index.html'));

    const graphResponse = await getGraphClient(tokenResponse.accessToken)
        .api(graphConfig.graphMe.endpoint);

    mainWindow.webContents.send(IPC_MESSAGES.SHOW_WELCOME_MESSAGE, account);
    mainWindow.webContents.send(IPC_MESSAGES.SET_PROFILE, graphResponse);
});