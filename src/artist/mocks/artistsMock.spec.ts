import { artistsMockData } from './artistsMock';

describe('artistsMockData:::', () => {
  it('Should load this mock successfully', () => {
    expect(artistsMockData).toBeDefined();
    expect(artistsMockData).toEqual([
      {
        id: 1,
        songName: 'Blinding Lights',
        albumName: 'After Hours',
        launchYear: 2019,
        playTimeValue: 36.568,
        playPorcentageValue: 7.29,
        streamListenValue: 29.658,
        streamPorcentageValue: 7.29,
      },
      {
        id: 2,
        songName: 'Blinding Lights 2',
        albumName: 'After Hours 2',
        launchYear: 2020,
        playTimeValue: 39.568,
        playPorcentageValue: 4.29,
        streamListenValue: 20.658,
        streamPorcentageValue: 4.29,
      },
      {
        id: 3,
        songName: 'Blinding Lights 3',
        albumName: 'After Hours 3',
        launchYear: 2021,
        playTimeValue: 46.568,
        playPorcentageValue: 9.29,
        streamListenValue: 39.658,
        streamPorcentageValue: 9.29,
      },
    ]);
  });
});
