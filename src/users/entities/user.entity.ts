import { ApiProperty } from '@nestjs/swagger';
// import { Exclude } from 'class-transformer';

export class User {
  @ApiProperty({ title: 'userId', description: 'user Id' })
  id: string;
  @ApiProperty({ title: 'name', description: 'user name' })
  name: string;
  @ApiProperty({ title: 'email', description: 'user email' })
  email: string;

  // @Exclude()
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
