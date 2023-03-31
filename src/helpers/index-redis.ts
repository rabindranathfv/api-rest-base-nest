export const addIndexData = (store) => {
  return store.reduce((acc, artist, index) => {
    const artistId = `artist_${index}`;
    const newAlbums = artist.albunes.reduce((albumsAcc, album, albumIndex) => {
      const albumId = `${artistId}_album_${albumIndex}`;
      const newSongs = album.canciones.reduce((songsAcc, song, songIndex) => {
        const songId = `${albumId}_song_${songIndex}`;
        const newSong = { ...song, id: songId };
        songsAcc.push(newSong);
        return songsAcc;
      }, []);
      const newAlbum = { ...album, id: albumId, canciones: newSongs };
      albumsAcc.push(newAlbum);
      return albumsAcc;
    }, []);
    const newArtist = { ...artist, id: artistId, albunes: newAlbums };
    acc.push(newArtist);
    return acc;
  }, []);
};
