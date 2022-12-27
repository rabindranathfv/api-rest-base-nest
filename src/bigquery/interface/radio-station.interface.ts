import { ApiProperty } from '@nestjs/swagger';

export class RadioStation {
  @ApiProperty({
    title: 'emisora_N1',
    description: 'info Radio station 1',
  })
  'emisora_N1': String;

  @ApiProperty({
    title: 'emisora_N2',
    description: 'info Radio station 2',
  })
  'emisora_N2': String;

  @ApiProperty({
    title: 'id_interprete',
    description: 'signer id',
  })
  'id_interprete': Number;

  @ApiProperty({
    title: 'interprete_colaboradores',
    description: 'interpreter collaborators',
  })
  'interprete_colaboradores': String;

  @ApiProperty({
    title: 'nombre_interprete',
    description: 'interpreter name',
  })
  'nombre_interprete': String;

  @ApiProperty({
    title: 'inserciones',
    description: 'inserts',
  })
  'inserciones': Number;

  @ApiProperty({
    title: 'universo',
    description: 'discografic universe',
  })
  'universo': Number;

  @ApiProperty({
    title: 'cobertura',
    description: 'discografic coverage',
  })
  'cobertura': Number;

  @ApiProperty({ title: 'cob', description: 'kpi cob' })
  'cob': Number;

  @ApiProperty({
    title: 'contactos',
    description: 'amount of contacts',
  })
  'contactos': Number;

  @ApiProperty({ title: 'grp_s', description: 'kpi grp_s' })
  'grp_s': Number;

  @ApiProperty({ title: 'ots', description: 'kpi ots' })
  'ots': Number;

  @ApiProperty({ title: 'ola', description: 'kpi ola' })
  'ola': String;

  @ApiProperty({
    title: 'fecha_peticion',
    description: 'request date',
  })
  'fecha_peticion': Date;
  //   {
  //     value: '2022-07-02';
  //   };

  @ApiProperty({ title: 'rango', description: 'query range' })
  'rango': String;

  @ApiProperty({
    title: 'rango_sort_order',
    description: 'range order',
  })
  'rango_sort_order': Number;

  @ApiProperty({ title: 'fecha', description: 'specific date' })
  'fecha': Date;
  //   {
  //     value: '2022-06-30';
  //   };
}
