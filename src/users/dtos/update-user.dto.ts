import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: "should be a user's full name",
    example: 'Adolfo Suarez',
    type: String,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiPropertyOptional({
    description: 'should be a valid email expresion',
    example: 'validEmail@gmail.com',
    uniqueItems: true,
    required: false,
    type: String,
  })
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: 'should be a valid password between 6 and 20 characters',
    example: 'Hol4apinew',
    minLength: 6,
    maxLength: 20,
    required: false,
    type: String,
  })
  password?: string;
}
