import type { IActiveSong, ISong } from "@/modules/player/interfaces/ISong";
import type { ITag } from "@/modules/player/interfaces/ITag";
import type { IPlaylist } from "@/modules/player/interfaces/IPlaylist";
import { get } from "svelte/store";
import { Howl, Howler } from "howler";
import {
  playlists,
  songsFiltered,
  songs,
  filterSearch,
  path,
  activeSong,
  isPaused,
  rate,
  newRate,
  volume,
  newVolume,
  tags,
  tagsSwitch,
  fadeTime,
  loop,
  shuffle,
  nightRate,
  slowRate,
  djMode,
  djModeStart,
  queue,
} from "@/constants/godStore";

let history: string[] = [];
let historyIndex: number = -1;

let oldVolume: number = 0.5;
let timeoutID;

const isInStoreTags = (songTagName: string, activeTags: ITag[]): boolean => {
  return activeTags.some((storeTag: ITag) => storeTag.name === songTagName);
};

//usar el Howler.pool para la lista de sonidos inactivos (autoplay)
export const player = {
  filter() {
    songsFiltered.update(() => {
      const activeTags: ITag[] = get(tags).filter((tag: ITag) => tag.active);
      const activePlaylists: IPlaylist[] = get(playlists).filter(
        (playlist: IPlaylist) => playlist.active
      );
      return get(songs).filter((song: ISong) => {
        // Search
        let songTitle: string = song.title.toLowerCase();
        let songArtist: string = song.artist.toLowerCase();

        const includeTitle: boolean = songTitle.includes(
          get(filterSearch).toLowerCase()
        );
        const includeArtist: boolean = songArtist.includes(
          get(filterSearch).toLowerCase()
        );

        // Tags
        let filterTags: boolean = false;

        if (get(tagsSwitch)) {
          // Miramos si algun tag de la cancion coincide con algun tag activo
          filterTags = activeTags.length
            ? song.tags.some((tagName: string) =>
                isInStoreTags(tagName, activeTags)
              )
            : true;
        } else {
          // Miramos si TODOS los tags de la cancion coincide con algun tag activo
          filterTags = activeTags.every((tag: ITag) =>
            song.tags.includes(tag.name)
          );
        }

        // Playlist
        let inPlaylistActive = true;

        if (activePlaylists.length) {
          inPlaylistActive = activePlaylists.some((p: IPlaylist) => {
            if (!p.playlist.length) return true;

            return p.playlist.some(
              (fileName: string) => fileName === song.fileName
            );
          });
        }

        return (
          (includeTitle || includeArtist) && filterTags && inPlaylistActive
        );
      });
    });
  },
  play(fileName: string, isHistory: boolean = false) {
    const howlsList = (Howler as any)._howls;
    if (howlsList.length === 1) {
      console.log(howlsList, get(fadeTime));
      timeoutID = setTimeout(() => howlsList[0].unload(), get(fadeTime) * 1000);
      howlsList[0].fade(get(volume), 0, get(fadeTime) * 1000);
    }

    if (howlsList.length === 2) {
      howlsList[0].unload();
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => howlsList[0].unload(), get(fadeTime) * 1000);
      howlsList[0].fade(get(volume), 0, get(fadeTime) * 1000);
    }

    //👍

    const howl = new Howl({
      src: [get(path) + fileName],
      rate: get(rate),
      volume: get(volume),
      onpause: () => isPaused.update(() => true),
      onplay: () => {
        isPaused.update(() => false);

        const song: ISong = get(songs).find(
          (song: ISong) => song.fileName === fileName
        );

        const newActiveSong: IActiveSong = {
          fileName: song.fileName,
          title: song.title,
          artist: song.artist,
          tags: song.tags,
          cover: song.cover,
          lyrics: song.lyrics,
          date: song.date,
          howl,
        };

        if (get(djMode)) {
          const startTime = (howl.duration() * get(djModeStart)) / 100;

          howl.seek(startTime);
        }

        activeSong.update(() => newActiveSong);
      },
    });

    howl.play();

    if (!isHistory) {
      history = history.slice(0, historyIndex + 1);
      history.push(fileName);
      historyIndex++;
    }
  },
  pause() {
    get(activeSong).howl ? get(activeSong).howl.pause() : null;
  },
  resume() {
    get(activeSong).howl ? get(activeSong).howl.play() : null;
  },
  back() {
    if (historyIndex) historyIndex--;

    player.play(history[historyIndex], true);
  },
  forth() {
    if (!get(queue).length && historyIndex < history.length - 1) {
      historyIndex++;
      player.play(history[historyIndex], true);

      return;
    }

    player.next();
  },
  next() {
    if (get(loop)) {
      player.play(get(activeSong).fileName);
      return;
    }

    if (get(queue).length) {
      player.play(get(queue)[0].fileName);
      player.removeSong(0);

      return;
    }

    //si la variable del random está on, las canciones de la cola son intocables, se pone random cuando acaban dichas canciones
    let finalID: number = 0;

    if (get(shuffle)) {
      finalID = Math.floor(Math.random() * get(songsFiltered).length);
      player.play(get(songsFiltered)[finalID].fileName);

      return;
    }

    const nextSongID: number =
      get(songsFiltered).findIndex(
        (song: ISong) => song.fileName === get(activeSong).fileName
      ) + 1;
    if (nextSongID < get(songsFiltered).length) finalID = nextSongID;

    player.play(get(songsFiltered)[finalID].fileName);
  },
  updateRate() {
    rate.update(() => get(newRate));
    if (get(activeSong).howl) get(activeSong).howl.rate(get(newRate));
  },
  updateSlowed() {
    newRate.update(() => (get(rate) >= 1 ? get(slowRate) : 1));

    player.updateRate();
  },

  updateNightcore() {
    newRate.update(() => (get(rate) <= 1 ? get(nightRate) : 1));

    //ha dejado de ir, Laia del futuro (el slowed tmb) aka: se está toggleando

    player.updateRate();
  },
  updateLoop() {
    loop.update((value) => !value);
  },

  updateShuffle() {
    shuffle.update((value) => !value);
  },
  updateVolume(newValue: string) {
    newVolume.update(() => Number(newValue));
    volume.update(() => get(newVolume));

    // Guardamos el valor antiguo
    oldVolume = get(newVolume);

    // Actualizamos la cancion que esta sonando ahora mismo
    if (get(activeSong).howl) get(activeSong).howl.volume(get(newVolume));

    window.localStorage.setItem("volume", JSON.stringify(get(newVolume)));
  },
  toggleMute() {
    volume.update(() => {
      newVolume.update(() => (get(volume) ? 0 : oldVolume));
      return get(newVolume);
    });

    if (get(activeSong).howl) get(activeSong).howl.volume(get(newVolume));
  },
  removeSong(i: number) {
    queue.update((value) => value.filter((_, index: number) => index != i));
  },

  createTag(name: string, color: string) {
    if (get(tags).find((value: ITag) => value.name === name)) {
      return "* El nombre que has puesto ya existe";
    }

    if (!name) return "* ¡El nombre esta vacio!";

    const tag: ITag = {
      name,
      color,
    };

    tags.update((tags: ITag[]) => [...tags, tag]);

    window.localStorage.setItem("tags", JSON.stringify(get(tags)));

    name = "";
    color = "";

    return "";
  },
};
