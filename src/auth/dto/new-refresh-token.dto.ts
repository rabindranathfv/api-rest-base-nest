import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'should be a valid email expresion',
    example: 'validEmail@gmail.com',
    uniqueItems: true,
    required: true,
    type: String,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'should be a username',
    example: 'validUserName',
    required: true,
    type: String,
  })
  name: string;
}
