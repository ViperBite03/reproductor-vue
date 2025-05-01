export type ISongMetadata = {
  title: string
  artist: string
  date: string
  extraData: {
    tags: string[]
    cover: string
    video?: string
  }
}
