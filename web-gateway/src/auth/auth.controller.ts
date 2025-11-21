import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUserDto } from './dto/sign-user.dto';
import { DecodeTokenDto } from './dto/decode-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-user')
  async signUser(@Body() signUserDto: SignUserDto) {
    try {
      const result = await this.authService.signUser(signUserDto);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to sign user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('decode-token')
  async decodeToken(@Body() decodeTokenDto: DecodeTokenDto) {
    try {
      const result = await this.authService.decodeToken(decodeTokenDto);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to decode token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
