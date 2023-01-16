import { radioStationStadistic } from './radioStationKPI';

describe('radioStationKPI:::', () => {
  it('Should load this mock successfully', () => {
    expect(radioStationStadistic).toBeDefined();
    expect(radioStationStadistic).toEqual({
      radioStations: [
        'LOS40 Dance',
        'LOS40',
        'LOS40 Classic',
        'LOS40 Urban',
        'Cadena Dial',
        'Cadena Dial Latino',
        'Cadena Dial Baladas',
        'Cadena Dial Esencial',
        'Cadena Dial Mini',
        'Radiolé',
      ],
      dataSet: [
        {
          name: 'cobertura',
          data: [50000, 20000, 16000, 10000, 8000, 7000, 6000, 2000, 1000, 800],
        },
      ],
    });
  });
});
