import path from 'path'

import { app, protocol, BrowserWindow, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { initialize } from '@electron/remote/main'
import settings from 'electron-settings'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

initialize()

async function createWindow () {
  console.log('create window')
  if (!settings.hasSync('main')) {
    console.log('setting defaults')
    settings.setSync('main', {
      x: undefined,
      y: undefined,
      width: 600,
      height: 600
    })
  }

  console.log(settings.getSync('main'))
  // Create the browser window.
  const { x, y, width, height } = settings.getSync('main')
  const win = new BrowserWindow({
    x,
    y,
    width,
    height,
    useContentSize: true,
    frame: false,
    webPreferences: {
      enableRemoteModule: true,
      preload: path.resolve(__dirname, '..', 'src', 'electron', 'preload.js'),
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
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
}

app.on('browser-window-created', (event, window) => {
  // console.log('browser-window-created', window)
  window.on('move', () => saveWindowProps(window))
  window.on('resize', () => saveWindowProps(window))
})

function saveWindowProps (window) {
  const tag = window.id === 1 ? 'main' : window.id
  settings.setSync(tag, window.getBounds())
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
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow()
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
