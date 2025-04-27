import { player } from '@/modules/player/scripts/player'
import { useMusicStore } from '@/modules/shared/constants/godStore'
import type { ISong } from '@/modules/player/interfaces/ISong'
import type { ISongMetadata } from '@/modules/backend/interfaces/ISongMetadata'

export const setAllSongs = async () => {
  const musicStore = useMusicStore()

  musicStore.path = await window.electron.ipcRenderer.invoke('get-path')
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
