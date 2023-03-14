import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { Exclude } from 'class-transformer';

export class User {
  @ApiProperty({ title: 'userId', description: 'user Id' })
  id?: string;

  @ApiProperty({ title: 'name', description: 'user name' })
  name: string;

  @ApiProperty({ title: 'email', description: 'user email' })
  email: string;

  // @Exclude()
  @ApiPropertyOptional({ title: 'password', description: 'user password' })
  password?: string;

  @ApiProperty({ title: 'cratedAt', description: 'timestamp created for user' })
  createdAt?: Date;

  @ApiProperty({
    title: 'updatedAt',
    description: 'timestamp updatedAt for user',
  })
  updatedAt?: Date;
}
