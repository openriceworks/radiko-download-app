import { app, shell, ipcMain, dialog, BrowserWindow, BrowserView, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { downloadAudio, getStationInfoList, getStationProgramList } from './radiko'
import { ProgramForCard, Settings, isCookies } from '../shared/types'
import * as store from './store'

// https://qiita.com/jumbOrNot/items/e19055700f59124556c0
process.env['PATH'] += ':/usr/local/bin/'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  session.defaultSession.cookies.addListener('changed', async (event) => {
    const cookies = await session.defaultSession.cookies.get({ url: 'https://radiko.jp/' })

    BrowserWindow.getAllWindows().forEach((window) => {
      if (window.getBrowserView()?.webContents.getURL() == 'https://radiko.jp/') {
        const cookiesObj = Object.fromEntries(cookies.map((cookie) => [cookie.name, cookie.value]))
        if (isCookies(cookiesObj)) {
          store.setCookies(cookiesObj)
        } else {
          console.error('Invalid cookies', cookiesObj)
        }
        window.close()
      }
      console.log(window.getBrowserView()?.webContents.getURL())
    })
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
ipcMain.handle('getStationList', async () => {
  return await getStationInfoList()
})

ipcMain.handle('getStationProgramList', async () => {
  return await getStationProgramList()
})

ipcMain.handle('downloadAudio', async (event, program: ProgramForCard) => {
  if (BrowserWindow.getAllWindows().length === 0) {
    return
  }
  const mainWindow = BrowserWindow.getAllWindows[0]

  const defaultPath = app.getPath('downloads') + `/${program.title}.wav`

  // ダウンロード先を指定するダイアログを表示
  const filePath = dialog.showSaveDialogSync(mainWindow, {
    defaultPath,
    filters: [
      {
        name: '*',
        extensions: ['wav']
      }
    ]
  })

  // キャンセルされたのでダウンロードしない
  if (filePath === undefined) {
    return false
  }

  return await downloadAudio(program.stationId, program.ft, program.to, filePath)
})

ipcMain.handle('getHistoryList', () => {
  return store.getDownloadResultList()
})

ipcMain.handle('getProgress', (event, program: ProgramForCard) => {
  return store.getDownloadResult(program.stationId, program.ft)
})

ipcMain.handle('getSettings', () => {
  return store.getSettings()
})

ipcMain.handle('setSettings', (event, settings: Settings) => {
  store.setSettings(settings)
})

ipcMain.handle('resetSettings', () => {
  store.reset()
  BrowserWindow.getAllWindows().forEach((window) => {
    window.close()
  })
})

ipcMain.handle('openLoginPage', () => {
  const win = new BrowserWindow({ width: 800, height: 600 })

  const view = new BrowserView()
  win.setBrowserView(view)
  view.setBounds({ height: 600, width: 800, x: 0, y: 0 })
  view.webContents.loadURL('https://radiko.jp/member/login')
})
