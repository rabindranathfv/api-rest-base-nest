export const SONG_REPOSITORY = 'SongRepository';

export interface SongRepository {
  findSongById(queryStr: string, id: string): Promise<boolean | any>;
}
