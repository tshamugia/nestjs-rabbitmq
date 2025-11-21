import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtService } from './jwt.service';

@Controller()
export class JwtController {
  constructor(private readonly jwtService: JwtService) {}

  @MessagePattern('jwt.sign')
  signToken(@Payload() userData: any) {
    console.log('Received jwt.sign request:', userData);
    return this.jwtService.signToken(userData);
  }

  @MessagePattern('jwt.decode')
  decodeToken(@Payload() data: { token: string }) {
    console.log('Received jwt.decode request');
    return this.jwtService.decodeToken(data);
  }
}
