import { UserRepository } from '../../repositories/user/user.repository';
import { Security } from '../../core/security';
import { AppError } from '../../core/errors';
import { config } from '../../core/config';
import { redisConnection } from '../../core/redis';
import { LoginDto, AuthResponseDto, CreateUserDto, UserResponseDto } from '../../types/user.types';


export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Register a new user
   */
  public async register(data: CreateUserDto): Promise<UserResponseDto> {
    // 1. Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // 2. Hash password
    const hashedPassword = await Security.hashPassword(data.password);

    // 3. Create user
    return this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }

  /**
   * Authenticate user and generate tokens
   */
  public async login(data: LoginDto): Promise<AuthResponseDto> {

    // 1. Find user by email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // 2. Verify password
    const isPasswordValid = await Security.verifyPassword(data.password, (user as any).password); // Need password from user model
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // 3. Generate tokens
    const accessToken = await Security.generateToken(
      { sub: user.id, email: user.email },
      config.paseto.accessTokenExpires
    );

    const refreshToken = await Security.generateToken(
      { sub: user.id },
      config.paseto.refreshTokenExpires
    );

    // 4. Store refresh token in Redis for session management
    // Key: refresh_token:<userId>, Value: refreshToken
    // Professional way: one refresh token per user or one per device
    await redisConnection.setex(
      `refresh_token:${user.id}`,
      7 * 24 * 60 * 60, // 7 days in seconds
      refreshToken
    );

    return {
      user: {
          id: user.id,
          email: user.email,
          name: user.name,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  public async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // 1. Verify PASETO token
      const payload = await Security.verifyToken(refreshToken);
      const userId = payload.sub as string;

      // 2. Check if refresh token exists in Redis (revocation check)
      const storedToken = await redisConnection.get(`refresh_token:${userId}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new AppError('Invalid or expired refresh token', 401);
      }

      // 3. Generate new access token
      const accessToken = await Security.generateToken(
        { sub: userId },
        config.paseto.accessTokenExpires
      );

      return { accessToken };
    } catch (error) {
       throw new AppError('Invalid refresh token', 401);
    }
  }

  /**
   * Logout user by revoking refresh token
   */
  public async logout(userId: string): Promise<void> {
    await redisConnection.del(`refresh_token:${userId}`);
  }
}
