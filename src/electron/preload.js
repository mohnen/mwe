const { contextBridge } = require('electron')
const { BrowserWindow } = require('@electron/remote')

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
    console.log('where am i')
    BrowserWindow.getFocusedWindow().close()
  }
})
