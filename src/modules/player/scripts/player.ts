import type { IActiveSong, ISong } from '@/modules/player/interfaces/ISong'
import type { ITag } from '@/modules/player/interfaces/ITag'
import type { IPlaylist } from '@/modules/player/interfaces/IPlaylist'
import { Howl, Howler } from 'howler'
import { useMusicStore } from '@/modules/shared/constants/godStore'

let history: string[] = []
let historyIndex: number = -1

let oldVolume: number = 0.5
let timeoutID

const isInStoreTags = (songTagName: string, activeTags: ITag[]): boolean => {
  return activeTags.some((storeTag: ITag) => storeTag.name === songTagName)
}

const getMusicStore = () => useMusicStore()

//usar el Howler.pool para la lista de sonidos inactivos (autoplay)
export const player = {
  filter() {
    const activeTags: ITag[] = getMusicStore().tags.filter((tag: ITag) => tag.active)
    const activePlaylists: IPlaylist[] = getMusicStore().playlists.filter((playlist: IPlaylist) => playlist.active)

    getMusicStore().songsFiltered = getMusicStore().songs.filter((song: ISong) => {
      // Search
      let songTitle: string = song.title.toLowerCase()
      let songArtist: string = song.artist.toLowerCase()

      const includeTitle: boolean = songTitle.includes(getMusicStore().filterSearch.toLowerCase())
      const includeArtist: boolean = songArtist.includes(getMusicStore().filterSearch.toLowerCase())

      // Tags
      let filterTags: boolean = false

      if (getMusicStore().tagsSwitch) {
        // Miramos si algun tag de la cancion coincide con algun tag activo
        filterTags = activeTags.length ? song.tags.some((tagName: string) => isInStoreTags(tagName, activeTags)) : true
      } else {
        // Miramos si TODOS los tags de la cancion coincide con algun tag activo
        filterTags = activeTags.every((tag: ITag) => song.tags.includes(tag.name))
      }

      // Playlist
      let inPlaylistActive = true

      if (activePlaylists.length) {
        inPlaylistActive = activePlaylists.some((p: IPlaylist) => {
          if (!p.playlist.length) return true

          return p.playlist.some((fileName: string) => fileName === song.fileName)
        })
      }

      return (includeTitle || includeArtist) && filterTags && inPlaylistActive
    })

    player.order()
  },
  order(desc: boolean = false) {
    if (!getMusicStore().orderBy) return

    if (getMusicStore().orderBy === 'shuffle') {
      return getMusicStore().songsFiltered.sort(() => Math.random() - 0.5)
    }

    getMusicStore().songsFiltered.sort((a: ISong, b: ISong) => {
      const valueA = a[getMusicStore().orderBy]
      const valueB = b[getMusicStore().orderBy]

      let comparison = 0

      if (getMusicStore().orderBy === 'date') {
        comparison = (valueA as Date).getTime() - (valueB as Date).getTime()
      } else {
        comparison = (valueA as string).localeCompare(valueB as string, undefined, { sensitivity: 'base' })
      }

      return desc ? -comparison : comparison
    })
  },
  play(fileName: string, isHistory: boolean = false) {
    const howlsList = (Howler as any)._howls

    if (howlsList.length === 1) {
      timeoutID = setTimeout(() => howlsList[0].unload(), getMusicStore().fadeTime * 1000)
      howlsList[0].fade(getMusicStore().volume, 0, getMusicStore().fadeTime * 1000)
    }

    if (howlsList.length === 2) {
      howlsList[0].unload()
      clearTimeout(timeoutID)
      timeoutID = setTimeout(() => howlsList[0].unload(), getMusicStore().fadeTime * 1000)
      howlsList[0].fade(getMusicStore().volume, 0, getMusicStore().fadeTime * 1000)
    }

    const mp3 = fileName.includes('.mp3') ? '' : '.mp3'

    const howl = new Howl({
      src: [getMusicStore().path + fileName + mp3],
      rate: getMusicStore().rate,
      volume: getMusicStore().volume,
      onpause: () => (getMusicStore().isPaused = true),
      onplay: () => {
        getMusicStore().isPaused = false

        const song: ISong = getMusicStore().songs.find((song: ISong) => song.fileName === fileName)

        const newActiveSong: IActiveSong = {
          fileName: song.fileName,
          title: song.title,
          artist: song.artist,
          tags: song.tags,
          cover: song.cover,
          lyrics: song.lyrics,
          date: song.date,
          video: song.video,
          howl,
        }

        if (getMusicStore().djMode) {
          const startTime = (howl.duration() * getMusicStore().djModeStart) / 100

          howl.seek(startTime)
        }

        getMusicStore().activeSong = newActiveSong
      },
      onplayerror: (err) => console.log(err),
    })

    howl.play()

    if (!isHistory) {
      history = history.slice(0, historyIndex + 1)
      history.push(fileName)
      historyIndex++
    }
  },
  pause() {
    getMusicStore().activeSong.howl ? getMusicStore().activeSong.howl.pause() : null
  },
  resume() {
    getMusicStore().activeSong.howl ? getMusicStore().activeSong.howl.play() : null
  },
  back() {
    if (historyIndex) historyIndex--

    player.play(history[historyIndex], true)
  },
  forth() {
    if (!getMusicStore().queue.length && historyIndex < history.length - 1) {
      historyIndex++
      player.play(history[historyIndex], true)

      return
    }

    player.next()
  },
  next() {
    if (getMusicStore().loop) {
      player.play(getMusicStore().activeSong.fileName)
      return
    }

    if (getMusicStore().queue.length) {
      player.play(getMusicStore().queue[0].fileName)
      player.removeSong(0)

      return
    }

    //si la variable del random está on, las canciones de la cola son intocables, se pone random cuando acaban dichas canciones
    let finalID: number = 0

    if (getMusicStore().shuffle) {
      finalID = Math.floor(Math.random() * getMusicStore().songsFiltered.length)
      player.play(getMusicStore().songsFiltered[finalID].fileName)

      return
    }

    const nextSongID: number =
      getMusicStore().songsFiltered.findIndex((song: ISong) => song.fileName === getMusicStore().activeSong.fileName) +
      1
    if (nextSongID < getMusicStore().songsFiltered.length) finalID = nextSongID

    player.play(getMusicStore().songsFiltered[finalID].fileName)
  },
  updateRate() {
    getMusicStore().rate = getMusicStore().newRate
    if (getMusicStore().activeSong.howl) getMusicStore().activeSong.howl.rate(getMusicStore().newRate)
  },
  updateSlowed() {
    getMusicStore().newRate = getMusicStore().rate >= 1 ? getMusicStore().slowRate : 1

    player.updateRate()
  },
  updateNightcore() {
    getMusicStore().newRate = getMusicStore().rate <= 1 ? getMusicStore().nightRate : 1
    //ha dejado de ir, Laia del futuro (el slowed tmb) aka: se está toggleando

    player.updateRate()
  },
  updateLoop() {
    getMusicStore().loop = !getMusicStore().loop
  },
  updateShuffle() {
    getMusicStore().shuffle = !getMusicStore().shuffle
  },
  updateVolume(newValue: string) {
    getMusicStore().newVolume = Number(newValue)
    getMusicStore().volume = getMusicStore().newVolume

    // Guardamos el valor antiguo
    oldVolume = getMusicStore().newVolume

    // Actualizamos la cancion que esta sonando ahora mismo
    if (getMusicStore().activeSong.howl) getMusicStore().activeSong.howl.volume(getMusicStore().newVolume)

    window.localStorage.setItem('volume', JSON.stringify(getMusicStore().newVolume))
  },
  toggleMute() {
    getMusicStore().newVolume = getMusicStore().volume ? 0 : oldVolume
    getMusicStore().volume = getMusicStore().newVolume

    if (getMusicStore().activeSong.howl) getMusicStore().activeSong.howl.volume(getMusicStore().newVolume)
  },
  removeSong(i: number) {
    getMusicStore().queue = getMusicStore().queue.filter((_, index: number) => index != i)
  },
  createTag(name: string, color: string) {
    if (getMusicStore().tags.find((value: ITag) => value.name === name)) {
      return '* El nombre que has puesto ya existe'
    }

    if (!name) return '* ¡El nombre esta vacio!'

    const tag: ITag = {
      name,
      color,
    }

    getMusicStore().tags = [...getMusicStore().tags, tag]

    window.localStorage.setItem('tags', JSON.stringify(getMusicStore().tags))

    name = ''
    color = ''

    return ''
  },
  removeTag(tagNameToRemove: string) {
    const tags: ITag[] = JSON.parse(window.localStorage.getItem('tags'))
    const newTags: ITag[] = tags.filter((tag: ITag) => tag.name != tagNameToRemove)

    getMusicStore().tags = newTags
    window.localStorage.setItem('tags', JSON.stringify(newTags))
    player.filter()
  },
  getTagColor(tagName: string): string {
    const tag: ITag = getMusicStore().tags.find((tag: ITag) => tag.name === tagName)

    return tag.color
  },
}
