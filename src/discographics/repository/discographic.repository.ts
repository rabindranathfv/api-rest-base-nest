export const DISCOGRAPHIC_REPOSITORY = 'DiscographicRepository';

export interface DiscographicRepository {
  // TODO: Add interface for discographics
  findAllDiscographics(queryStr: string): Promise<any>;
  findDiscographicById(queryStr: string, id: string): Promise<boolean | any>;
}
