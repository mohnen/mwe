const { contextBridge, ipcRenderer } = require('electron')
const { BrowserWindow } = require('@electron/remote')
const { description, homepage, author, version } = require('../../package.json')

contextBridge.exposeInMainWorld('windowAPI', {
  minimize () {
    BrowserWindow.getFocusedWindow().minimize()
  },

  toggleMaximize () {
    const win = BrowserWindow.getFocusedWindow()

    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  },

  close () {
    BrowserWindow.getFocusedWindow().close()
  },

  newWidget () {
    console.log('newWidget')
    return ipcRenderer.invoke('newWidget')
  }
})

contextBridge.exposeInMainWorld('package', {
  description, homepage, author, version
})
