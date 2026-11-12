import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { generateRawToken, hashToken } from '../utils/session.js';
import { UnauthorizedError } from '../utils/errors.js';
import { Role } from '@prisma/client';

export interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  rawToken: string;
  expiresAt: Date;
}

export class AuthService {
  /**
   * Authenticates user credentials and generates a new hashed session in PostgreSQL.
   */
  async login(
    email: string,
    passwordPlain: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthResult> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    // Generate high-entropy raw token for cookie, store only SHA-256 hash in DB
    const rawToken = generateRawToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + config.sessionMaxAgeMs);

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        userAgent: userAgent ? userAgent.slice(0, 255) : null,
        ipAddress: ipAddress ? ipAddress.slice(0, 45) : null,
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      rawToken,
      expiresAt,
    };
  }

  /**
   * Revokes an active session in PostgreSQL, rendering the token permanently unusable.
   */
  async logout(rawToken?: string): Promise<void> {
    if (!rawToken) return;

    const tokenHash = hashToken(rawToken);
    await prisma.session.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Retrieves current authenticated user context.
   */
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User account not found.');
    }

    return user;
  }
}

export const authService = new AuthService();
