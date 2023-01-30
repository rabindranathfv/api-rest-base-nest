export const SONG_REPOSITORY = 'SongRepository';

export interface SongRepository {
  getSongById(id: string): Promise<boolean | any>;
  getSummarySongById(id: string): Promise<boolean | any>;
  getKpiRadioSongById(id: string): Promise<boolean | any>;
  getKpisSongById(id: string): Promise<boolean | any>;
}
