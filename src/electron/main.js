import path from 'path'

import { app, protocol, BrowserWindow, dialog, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { initialize } from '@electron/remote/main'

import trackedBrowserWindow from './trackedBrowserWindow.js'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

initialize()

async function createWindow (tag, route) {
  console.log('create window', tag, route)
  const win = trackedBrowserWindow(tag, {
    useContentSize: true,
    frame: false,
    fullscreenable: false,
    webPreferences: {
      nativeWindowOpen: true,
      enableRemoteModule: true,
      preload: path.resolve(__dirname, '..', 'src', 'electron', 'preload.js'),
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  }, { width: 800, height: 600 })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    console.log('loadURL', `${process.env.WEBPACK_DEV_SERVER_URL}/${route}.html`)
    await win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}/${route}.html`)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL(`app://./${route}.html`)
  }

  win.on('close', (e) => {
    const wereDevToolsOpened = win.webContents.isDevToolsOpened()
    if (wereDevToolsOpened) win.webContents.closeDevTools()
    const choice = false && dialog.showMessageBoxSync(win,
      {
        type: 'question',
        buttons: ['Yes', 'No, hang on', 'third option'],
        title: 'Confirm your actions',
        message: 'Do you really want to close the application?'
      }
    )
    console.log('CHOICE: ', choice)
    if (choice > 0) {
      if (wereDevToolsOpened) win.webContents.openDevTools()
      e.preventDefault()
    }
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    console.log('setWindowOpenHandler', url)
    // dialog.showErrorBox('window.open disallowed', 'bla bla')
    return {
      action: 'allow',
    }
  })
  return win
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow('main', 'index')
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow('main', 'index')
})

ipcMain.handle('newWidget', async (event) => {
  const widgetwin = await createWindow('widget', 'widget')
  return widgetwin.id
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
