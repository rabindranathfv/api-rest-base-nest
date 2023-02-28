export const ARTIST_REPOSITORY = 'ArtistRepository';

export interface ArtistRepository {
  getAllSongsByArtistsById(
    id: string,
    filter: string,
    searchText: string,
  ): Promise<any[]> | null;
  getSummaryArtistById(id: string): Promise<any> | null;
  getKpiRadioArtistById(id: string): Promise<any> | null;
  getAllArtists(filter: string, searchText: string): Promise<any> | null;
}
