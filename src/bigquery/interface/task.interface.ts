import { ApiProperty } from '@nestjs/swagger';

export class TaskDS {
  @ApiProperty({
    title: 'done',
    description: 'state of the task',
  })
  'done': Boolean;

  @ApiProperty({
    title: 'created',
    description: 'date of creation of the task',
  })
  'created': Boolean;

  @ApiProperty({
    title: 'description',
    description: 'description of the task',
  })
  'description': Boolean;
}
