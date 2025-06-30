import { player } from '@/modules/player/scripts/player'
import { useMusicStore } from '@/modules/shared/constants/godStore'
import type { ISong } from '@/modules/player/interfaces/ISong'
import type { ISongMetadata } from '@/modules/backend/interfaces/ISongMetadata'

export const setAllSongs = async () => {
  const musicStore = useMusicStore()
  const fileNames: string[] = await window.electron.ipcRenderer.invoke('get-song-file-names')

  let allSongs: ISong[] = []
  let tagsFromSongs: any = new Set()

  await Promise.all(
    fileNames.map(async (fileName: string) => {
      const metaSong: ISongMetadata = await window.electron.ipcRenderer.invoke('read-metadata', fileName)

      const song: ISong = {
        fileName: fileName,
        title: metaSong.title || fileName,
        artist: metaSong.artist || '',
        tags: metaSong.extraData.tags,
        date: new Date(metaSong.date),
        cover: metaSong.extraData.cover || '',
        video: metaSong.extraData.video,
        curiosity: metaSong.extraData.curiosity || '',
        lyrics: '',
      }

      for (let tag of song.tags) tagsFromSongs.add(tag)

      allSongs.push(song)
    })
  )

  for (let tag of tagsFromSongs) {
    player.createTag(tag, '#FFFFFF')
  }

  musicStore.songs = allSongs // [song, ...musicStore.songs]
  musicStore.songsFiltered = allSongs

  musicStore.orderBy = 'artist'
  player.order()
}

export const setColor = (hexColor: string): string => {
  if (hexColor.startsWith('#')) hexColor = hexColor.slice(1)

  const r = parseInt(hexColor.substring(0, 2), 16) / 255
  const g = parseInt(hexColor.substring(2, 4), 16) / 255
  const b = parseInt(hexColor.substring(4, 6), 16) / 255

  const adjust = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))

  const L = 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b)
  const contrastWithWhite = 1.05 / (L + 0.05)

  return contrastWithWhite < 2 ? 'black' : 'white'
}
