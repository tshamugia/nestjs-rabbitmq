import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: string | number;

  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.expiresIn = process.env.JWT_EXPIRATION || '1h';
  }

  signToken(userData: any): { token: string } {
    try {
      const token = jwt.sign(userData, this.secret, {
        expiresIn: this.expiresIn as any,
      });
      return { token };
    } catch (error) {
      throw new Error(`Failed to sign token: ${error.message}`);
    }
  }

  decodeToken(data: { token: string }): {
    valid: boolean;
    user?: any;
    error?: string;
  } {
    try {
      const decoded = jwt.verify(data.token, this.secret);
      return {
        valid: true,
        user: decoded,
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }
}
