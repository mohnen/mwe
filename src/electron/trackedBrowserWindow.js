import { app, BrowserWindow } from 'electron'
import settings from 'electron-settings'

app.on('browser-window-created', (event, window) => {
  window.on('move', () => saveWindowProps(window))
  window.on('resize', () => saveWindowProps(window))
})

function saveWindowProps (window) {
  if (!window.tag) {
    console.log(`window ${window.id} is not (yet?) tracked`)
    return
  }
  settings.setSync(window.tag, window.getBounds())
}

export default function (tag, options, defaults) {
  console.log('creating trackedWindow')
  if (!settings.hasSync(tag)) {
    console.log(`setting defaults for ${tag}`)
    settings.setSync(tag, defaults)
  }
  const current = settings.getSync(tag)
  const window = new BrowserWindow({ ...options, ...current })
  window.tag = tag
  return window
}
