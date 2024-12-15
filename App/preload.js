/** The preload.js file is used to allow the renderer to talk to the filesystem only with selective methods
 * preload acts as the bridge between the renderer and the system.
 * preload mostly contains:
 * any logic that modifies the system goes through preload
 * business logic that doesnt require access to system resources like filesystem all
 * database connectivity
 */

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("renderer", {
  sendLoginMessage: () => {
    ipcRenderer.send("LOGIN");
  },
  sendSignOutMessage: () => {
    ipcRenderer.send("LOGOUT");
  },
  sendCheckProfileMessage: () => {
    ipcRenderer.send("GET_PROFILE");
  },
  handleProfileData: (func) => {
    ipcRenderer.on("SET_PROFILE", (event, ...args) => func(event, ...args));
  },
  showWelcomeMessage: (func) => {
    ipcRenderer.on("SHOW_WELCOME_MESSAGE", (event, ...args) => func(event, ...args));
  },
});
