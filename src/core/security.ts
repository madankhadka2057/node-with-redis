import argon2 from 'argon2';
import { V4 } from 'paseto';
import { config } from './config';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export class Security {
  private static readonly privateKey = Security.initializePrivateKey();
  private static readonly publicKey = Security.initializePublicKey();

  private static initializePrivateKey() {
    try {
      const keyPath = path.join(process.cwd(), 'keys', 'private.pem');
      if (!fs.existsSync(keyPath)) {
        console.warn(`[Security] Private key not found at ${keyPath}`);
        return null;
      }
      const key = fs.readFileSync(keyPath, 'utf8');
      return crypto.createPrivateKey(key);
    } catch (err: any) {
      console.error('[Security] Failed to initialize Private Key:', err.message);
      return null;
    }
  }

  private static initializePublicKey() {
    try {
      const keyPath = path.join(process.cwd(), 'keys', 'public.pem');
      if (!fs.existsSync(keyPath)) {
        console.warn(`[Security] Public key not found at ${keyPath}`);
        return null;
      }
      const key = fs.readFileSync(keyPath, 'utf8');
      // Return as KeyObject for consistency and better performance
      return crypto.createPublicKey(key);
    } catch (err: any) {
      console.error('[Security] Failed to initialize Public Key:', err.message);
      return null;
    }
  }

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
   */
  public static async generateToken(payload: Record<string, any>, expires: string): Promise<string> {
    if (!this.privateKey) {
      throw new Error('Security module not initialized: Private key missing');
    }
    return V4.sign(payload, this.privateKey, {
      expiresIn: expires,
      iat: true,
    });
  }

  /**
   * Verifies a PASETO token (v4.public)
   */
  public static async verifyToken(token: string): Promise<Record<string, any>> {
    if (!this.publicKey) {
      throw new Error('Security module not initialized: Public key missing');
    }
    return V4.verify(token, this.publicKey);
  }
}



