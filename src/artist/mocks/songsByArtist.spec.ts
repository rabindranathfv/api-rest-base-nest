import { songsByartistsMockData } from './songsByArtist';

describe('songsByartistsMockData:::', () => {
  it('Should load this mock successfully', () => {
    expect(songsByartistsMockData).toBeDefined();
    expect(songsByartistsMockData.length).toBe(7);
  });
});
