import { ApiProperty } from '@nestjs/swagger';

export class Token {
  @ApiProperty({ title: 'token', description: 'user token for authentication' })
  token!: string;
}
