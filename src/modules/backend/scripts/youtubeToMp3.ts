import fs from 'fs'
import path from 'path'
import id3 from 'node-id3'
import { pipeline } from 'stream'
import { promisify } from 'util'
import type { IScrapData } from '@/modules/backend/interfaces/IScrapData'
import type { ISongMetadata } from '@/modules/backend/interfaces/ISongMetadata'
import { musicPath } from '@/modules/backend/scripts/getMusicPath'

const streamPipeline = promisify(pipeline)

export const downloadFile = async (url: string, fileName: string): Promise<string> => {
  const filePath = path.join(musicPath, fileName + '.mp3')
  const response = await fetch(url)

  await streamPipeline(response.body, fs.createWriteStream(filePath))

  return fileName + '.mp3'
}

export const scrapSong = async (youtubeUrl: string): Promise<IScrapData> => {
  const { ytmp3 } = await import('@vreden/youtube_scraper')

  let songData: IScrapData = {
    youtubeURL: '',
    youtubeTitle: '',
    miniatura: '',
    views: '',
    age: '',
    artist: '',
    artistChannel: '',
    error: '',
    downloadURL: '',
  }

  try {
    console.log('Scrapping...')
    const result = await ytmp3(youtubeUrl)

    console.log(result)

    songData.youtubeURL = result.metadata.url
    songData.youtubeTitle = result.metadata.title
    songData.miniatura = result.metadata.image
    songData.views = result.metadata.views
    songData.age = result.metadata.ago
    songData.artist = result.metadata.author.name
    songData.artistChannel = result.metadata.url
    songData.downloadURL = result.download.url
  } catch (err) {
    songData.error = err
    console.error(youtubeUrl, err)
  }

  return songData
}

export const writeMetaData = async (metadata: ISongMetadata, fileName: string) => {
  const mp3 = fileName.includes('.mp3') ? '' : '.mp3'
  const filePath = `${musicPath}/${fileName}${mp3}`

  const parsedMetadata = {
    title: metadata.title,
    artist: metadata.artist,
    date: new Date(metadata.date).toDateString(),
    genre: JSON.stringify(metadata.extraData),
  }

  id3.update(parsedMetadata, filePath)
}

export const readMetaData = async (fileName: string): Promise<ISongMetadata> => {
  const mp3 = fileName.includes('.mp3') ? '' : '.mp3'
  const filePath = `${musicPath}/${fileName}${mp3}`

  const result = await id3.Promise.read(filePath)

  const metadata: ISongMetadata = {
    title: result.title,
    artist: result.artist,
    date: new Date(result.date).toDateString(),
    extraData: JSON.parse(result.genre),
  }

  return metadata
}

export const getSongFileNames = async () => {
  return await fs.readdirSync(musicPath)
}

export const deleteFile = async (fileName: string) => {
  const songPath = `${musicPath}/${fileName}`

  fs.unlink(songPath, (err) => {
    if (err) {
      console.error('An error occurred:', err)
    } else {
      console.log('File deleted successfully!')
    }
  })
}
