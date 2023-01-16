import { artistKpiOverview } from './artistKpiOverview';

describe('artistKpiOverview:::', () => {
  it('Should load this mock successfully', () => {
    expect(artistKpiOverview).toBeDefined();
    expect(artistKpiOverview).toEqual({
      playedArtist: {
        grow: 1.9,
        kpiValue: 129658,
        label: 'Tocadas',
        color: '#7CB8F0',
      },
      streamsArtist: {
        grow: 2.2,
        kpiValue: 15290351,
        label: 'Streams',
        color: '#F0A67C',
      },
    });
  });
});
