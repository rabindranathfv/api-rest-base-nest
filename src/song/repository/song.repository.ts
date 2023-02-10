export const SONG_REPOSITORY = 'SongRepository';

export interface SongRepository {
  getSummarySongById(id: string): Promise<boolean | any>;
  getKpiRadioSongById(id: string): Promise<boolean | any>;
  getKpisSongById(id: string): Promise<boolean | any>;
}
