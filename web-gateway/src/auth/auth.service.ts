import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignUserDto } from './dto/sign-user.dto';
import { DecodeTokenDto } from './dto/decode-token.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('JWT_SERVICE') private readonly jwtClient: ClientProxy,
  ) {}

  async signUser(signUserDto: SignUserDto) {
    try {
      const result = await firstValueFrom(
        this.jwtClient.send('jwt.sign', signUserDto),
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to sign user: ${error.message}`);
    }
  }

  async decodeToken(decodeTokenDto: DecodeTokenDto) {
    try {
      const result = await firstValueFrom(
        this.jwtClient.send('jwt.decode', decodeTokenDto),
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to decode token: ${error.message}`);
    }
  }
}
