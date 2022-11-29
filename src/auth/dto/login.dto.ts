import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'should be a valid email expresion',
    example: 'validEmail@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({
    description: 'should be a valid password between 6 and 20 characters',
    example: 'Hol4apinew',
  })
  password: string;
}
