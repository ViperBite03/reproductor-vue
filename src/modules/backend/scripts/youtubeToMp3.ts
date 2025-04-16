import { ytmp3 } from '@vreden/youtube_scraper'
import fs from 'fs'
import path from 'path'
import id3 from 'node-id3'
import { pipeline } from 'stream'
import { promisify } from 'util'

const streamPipeline = promisify(pipeline)

const downloadFile = async (url: string, fileName: string) => {
  const musicFolderPath = path.join(process.cwd(), 'music')

  if (!fs.existsSync(musicFolderPath)) {
    fs.mkdirSync(musicFolderPath, { recursive: true })
  }

  const filePath = path.join(musicFolderPath, fileName + '.mp3')

  const response = await fetch(url)

  await streamPipeline(response.body, fs.createWriteStream(filePath))
}

export const downloadSong = async (youtubeUrl: string): Promise<string> => {
  let songData = ''

  try {
    const result = await ytmp3(youtubeUrl)
    const songName = result.metadata.title

    await downloadFile(result.download.url, songName)
  } catch (err) {
    console.error(youtubeUrl, err)
  }

  return songData
}

/* OLD */

export const writeMetaData = async ({ fileName, metaData }) => {
  const path = await process.cwd()
  const mp3 = fileName.includes('.mp3') ? '' : '.mp3'
  const filePath = `${path}/music/${fileName}${mp3}`

  id3.update(metaData, filePath)
}

export const readMetaData = async (fileName: string) => {
  const path = await process.cwd()
  const filePath = `${path}/music/${fileName}`

  return id3.Promise.read(filePath)
}

export const getSongFileNames = async () => {
  const path = await process.cwd()
  const directoryPath = `${path}/music/`

  return await fs.readdirSync(directoryPath)
}
