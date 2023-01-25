export const ARTIST_REPOSITORY = 'ArtistRepository';

export interface ArtistRepository {
  getAllArtists(): Promise<any[]> | null;
  getAllSongsByArtists(id: string): Promise<any[]> | null;
  getArtistSummary(id: string): Promise<any> | null;
  getArtistKpi(id: string): Promise<any> | null;
  getArtistRadioStationKpi(id: string): Promise<any> | null;
  getArtistById(id: string): Promise<any>;
}
