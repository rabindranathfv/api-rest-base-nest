export const ARTIST_REPOSITORY = 'ArtistRepository';

export interface ArtistRepository {
  getAllSongsByArtistsById(id: string): Promise<any[]> | null;
  getSummaryArtistById(id: string): Promise<any> | null;
  getKpiRadioArtistById(id: string): Promise<any> | null;
  getAllArtists(): Promise<any> | null;
}
