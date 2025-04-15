export interface IPlaylist {
  id: number;
  title: string;
  image?: string;
  active?: boolean;
  playlist: string[];
}
