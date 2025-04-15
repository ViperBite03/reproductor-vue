import { downloadVideo, getVideoTitle, getVideoMP3Base64 } from 'yt-get';
import fs from 'fs';
import id3 from 'node-id3';

export const downloadSong = async (youtubeUrl: string): Promise<string> => {
  if (!youtubeUrl) return '';
  const x = await getVideoMP3Base64(youtubeUrl);
};

export const writeMetaData = async ({ fileName, metaData }) => {
  const path = await process.cwd();
  const mp3 = fileName.includes('.mp3') ? '' : '.mp3';
  const filePath = `${path}/music/${fileName}${mp3}`;

  id3.update(metaData, filePath);
};

export const readMetaData = async (fileName: string) => {
  const path = await process.cwd();
  const filePath = `${path}/music/${fileName}`;

  return id3.Promise.read(filePath);
};

export const getSongFileNames = async () => {
  const path = await process.cwd();
  const directoryPath = `${path}/music/`;

  return await fs.readdirSync(directoryPath);
};
