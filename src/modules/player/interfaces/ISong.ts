import type { Howl } from 'howler'

export interface ISong {
  fileName: string
  title: string
  artist: string
  tags: string[]
  cover: string
  lyrics: string
  date: Date
  video: string
}

export interface IActiveSong extends ISong {
  howl?: Howl | null
}
