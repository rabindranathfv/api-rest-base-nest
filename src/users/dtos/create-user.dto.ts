import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "should be a user's full name",
    example: 'Adolfo Suarez',
    required: true,
    type: String,
  })
  name: string;

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
    description: 'should be a valid password between 6 and 20 characters',
    example: 'Hol4apinew',
    minLength: 6,
    maxLength: 20,
    required: true,
    type: String,
  })
  password: string;
}
