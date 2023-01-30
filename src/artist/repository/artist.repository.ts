export const ARTIST_REPOSITORY = 'ArtistRepository';

export interface ArtistRepository {
  getAllArtists(): Promise<any[]> | null;
  getArtistById(id: string): Promise<any>;
  getAllSongsByArtistsById(id: string): Promise<any[]> | null;
  getSummaryArtistById(id: string): Promise<any> | null;
  getKpiRadioArtistById(id: string): Promise<any> | null;
}
