import argon2 from 'argon2';
import { V4 } from 'paseto';
import { config } from './config';
import crypto from 'crypto';

export class Security {
  private static readonly privateKey = crypto.createPrivateKey(config.paseto.privateKey.replace(/\\n/g, '\n'));
  private static readonly publicKey = config.paseto.publicKey.replace(/\\n/g, '\n');

  /**
   * Hashes a password using Argon2
   */
  public static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  /**
   * Verifies a password against a hash
   */
  public static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  /**
   * Generates a PASETO token (v4.public)
   * Note: v4.public is an asymmetric signature
   */
  public static async generateToken(payload: Record<string, any>, expires: string): Promise<string> {
    return V4.sign(payload, this.privateKey, {
        expiresIn: expires,
        iat: true,
    });
  }

  /**
   * Verifies a PASETO token (v4.public)
   */
  public static async verifyToken(token: string): Promise<Record<string, any>> {
    return V4.verify(token, this.publicKey);
  }
}


