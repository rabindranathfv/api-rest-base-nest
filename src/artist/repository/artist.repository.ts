export const ARTIST_REPOSITORY = 'ArtistRepository';

export interface ArtistRepository {
  getAllArtists(queryStr: string): Promise<any[]> | null;
  getAllSongsByArtists(queryStr: string): Promise<any[]> | null;
  getArtistSummary(queryStr: string): Promise<any> | null;
  getArtistKpi(queryStr: string): Promise<any> | null;
  getArtistRadioStationKpi(queryStr: string): Promise<any> | null;
}
