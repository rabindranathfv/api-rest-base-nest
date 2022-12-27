import { ApiProperty } from '@nestjs/swagger';

export class LoginAuth {
  @ApiProperty({ title: 'userId', description: 'user Id' })
  id: string;

  @ApiProperty({ title: 'name', description: "user's email" })
  name: string;

  @ApiProperty({ title: 'email', description: "user's email" })
  email: string;

  @ApiProperty({ title: 'password', description: 'password for auth' })
  password: string;

  @ApiProperty({ title: 'token', description: 'token info' })
  token: string;
}
