import { IsNotEmpty, IsString } from 'class-validator';

export class DecodeTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
