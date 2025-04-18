export const cleanYouTubeTitle = (input: string, authorChannel: string = '') => {
  let clean = input
    .replace(/\(.*?\)/g, '') // elimina paréntesis
    .replace(/\[.*?\]/g, '') // elimina corchetes
    .replace(/\".*?\"/g, '') // elimina comillas
    .replace(/\s*\|\s*/g, ' - ') // reemplaza pipes por guión
    .replace(/『.*?』/g, '') // caracteres japoneses entre comillas
    .replace(/♡/g, '') // limpia símbolos decorativos
    .replace(/[<>:"/\\|?*]/g, '') // caracteres ilegales
    .replace(/\s{2,}/g, ' ') // espacios dobles
    .replace(/\.+$/, '') // puntos al final
    .replace(/(?:Subtitulad[oa]s?|Sub\.? Español|Lyrics?|Lyric Video|AMV)/gi, '') // limpia términos comunes
    .replace(/\s{2,}/g, ' ') // espacios múltiples
    .trim()

  const separator = ' - '
  if (clean.includes(separator)) {
    const [author, ...rest] = clean.split(separator)
    const title = rest.join(separator).trim()
    return {
      title: title,
      author: author.trim(),
    }
  }

  return {
    title: clean.trim(),
    author: authorChannel,
  }
}
