import { defineStore } from 'pinia'
import type { ISong, IActiveSong } from '@/modules/player/interfaces/ISong'
import type { ITag } from '@/modules/player/interfaces/ITag'
import type { IPlaylist } from '@/modules/player/interfaces/IPlaylist'

export const useMusicStore = defineStore('music', {
  state: () => ({
    playlists: [] as IPlaylist[],
    songs: [] as ISong[],
    songsFiltered: [] as ISong[],
    queue: [] as ISong[],
    panel: '', // IPanelOptions
    tags: [] as ITag[],
    tagsSwitch: false,
    filterSearch: '',
    path: '',
    isPaused: true,
    rate: 1,
    newRate: 1,
    nightRate: 1.2,
    slowRate: 0.9,
    djMode: false,
    djModeStart: 20,
    djModeFinish: 80,
    volume: 0.1,
    newVolume: 0.1,
    selectedSongForUpdate: undefined as ISong | undefined,
    selectedPlaylistForUpdate: undefined as IPlaylist | undefined,
    fadeTime: 5,
    loop: false,
    shuffle: false,
    editingSong: null as ISong,

    orderBy: '',
    filterBy: '',

    activeSong: {
      fileName: '',
      title: '',
      artist: '',
      tags: [],
      cover: '',
      lyrics: '',
      date: new Date(),
      howl: null,
    } as IActiveSong,
  }),
})
