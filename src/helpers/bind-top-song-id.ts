export const bindTopSongId = (artist) => {
  const { top_cancion } = artist;

  if (top_cancion) {
    const correspondingSong = artist.albunes
      .flatMap((album) => album.canciones)
      .find(
        (song) =>
          song.nombre.trim().toLowerCase() ===
          top_cancion.nombre.trim().toLowerCase(),
      );

    if (correspondingSong) {
      const { id } = correspondingSong;
      artist.top_cancion = { id, ...top_cancion };
    }
  }

  return artist;
};
