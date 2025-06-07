import { app } from 'electron'
import path from 'node:path'
import fs from 'fs'

const externalMusicPath = path.join(app.getPath('userData'), 'music')

if (!fs.existsSync(externalMusicPath)) {
  fs.mkdirSync(externalMusicPath, { recursive: true })
}

export const musicPath: string = externalMusicPath
