import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'node:path'
import started from 'electron-squirrel-startup'
import { musicPath } from '@/modules/backend/scripts/getMusicPath'
import fs from 'fs'
import type { IScrapData } from '@/modules/backend/interfaces/IScrapData'
import {
  scrapSong,
  downloadFile,
  writeMetaData,
  readMetaData,
  getSongFileNames,
  deleteFile,
} from '@/modules/backend/scripts/youtubeToMp3'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit()
}

const createWindow = () => {
  const iconPath =
    process.env.NODE_ENV === 'development'
      ? path.join(process.cwd(), 'src', 'favicons', 'favicon.ico')
      : path.join(process.resourcesPath, 'favicons', 'favicon.ico')

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1700,
    height: 900,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // and load the index.html of the app == este error no hace nada :)
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  // Open the DevTools.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle('scrap-song', async (_, youtubeUrl): Promise<IScrapData> => scrapSong(youtubeUrl))
ipcMain.handle('download-file', async (_, youtubeUrl, fileName) => downloadFile(youtubeUrl, fileName))
ipcMain.handle('delete-file', async (_, fileName) => deleteFile(fileName))
ipcMain.handle('write-metadata', async (_, metadata, fileName) => writeMetaData(metadata, fileName))
ipcMain.handle('read-metadata', async (_, fileName) => readMetaData(fileName))
ipcMain.handle('get-song-file-names', getSongFileNames)
ipcMain.handle('load-audio-blob', async (_, fileName) => {
  const fullPath = path.join(musicPath, fileName)
  const buffer = fs.readFileSync(fullPath)
  return buffer.toString('base64')
})
ipcMain.handle('open-path', () => shell.openPath(musicPath))
ipcMain.handle('reset-app', () => {
  app.relaunch()
  app.exit(0)
})
