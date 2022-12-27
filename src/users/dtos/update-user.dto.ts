import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "should be a user's full name",
    example: 'Adolfo Suarez',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'should be a valid email expresion',
    example: 'validEmail@gmail.com',
    uniqueItems: true,
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'should be a valid password between 6 and 20 characters',
    example: 'Hol4apinew',
    minLength: 6,
    maxLength: 20,
    required: false,
  })
  password?: string;
}
