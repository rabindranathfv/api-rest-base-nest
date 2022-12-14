export const ARTIST_REPOSITORY = 'ArtistRepository';

export interface ArtistRepository {
  getAllArtists(queryStr: string): Promise<any[]> | null;
}
