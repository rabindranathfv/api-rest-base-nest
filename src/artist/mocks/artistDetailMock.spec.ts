import { artistDetailMockData } from './artistDetailMock';

describe('artistDetailMock:::', () => {
  it('Should load this mock successfully', () => {
    expect(artistDetailMockData).toBeDefined();
    expect(artistDetailMockData).toEqual({
      artistName: 'The Weekend',
      companyRecordName: 'Republic Records',
      songsAmount: 140,
      songName: 'Songs Blinding Lights',
      albumName: 'After Hours',
      playTimeDetailValue: 1.589,
      streamListenDetailValue: 150.365,
      colaborationDetailValue: 180.698,
    });
  });
});
