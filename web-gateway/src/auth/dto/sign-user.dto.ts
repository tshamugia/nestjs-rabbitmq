import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

}
