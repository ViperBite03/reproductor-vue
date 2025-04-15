import { ytmp3 } from '@vreden/youtube_scraper';
import fs from 'fs';
import path from 'path';
import https from 'https';

const downloadFile = (url: string, outputFolder: string, fileName: string) => {
  const filePath = path.join(outputFolder, fileName);

  const file = fs.createWriteStream(filePath);
  https
    .get(url, (response) => {
      response.pipe(file);

      file.on('finish', () => file.close());
    })
    .on('error', (err) => {
      fs.unlink(filePath, () => {});
      console.error(`❌ Error al descargar: ${err.message}`);
    });
};

export const downloadSong = async (youtubeUrl: string): Promise<string> => {
  let songData = '';

  try {
    const result = await ytmp3(youtubeUrl);

    const songName = result.name;
    await downloadFile(result.url, '/music', songName);

    console.log(result);
  } catch (err) {
    console.error('🚨 Ups! Ha habido un problema descargando el MP3');
  }

  return songData;
};

/* OLD */

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
