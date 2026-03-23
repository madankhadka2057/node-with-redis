import { UserRepository } from '../../repositories/user/user.repository';
import { CreateUserDto, UserResponseDto } from '../../types/user.types';
import { AppError } from '../../core/errors';
import { Queue } from 'bullmq';
import { CreateUserType } from '../../validations/user/user.validation';
import { PaginatedResult, PaginateOptions } from '../../types/prisma.types';
import { CacheService } from '../../core/cache';
import { CACHE_TTL_SECONDS } from '../../core/constants';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailQueue: Queue
  ) { }

  async registerUser(data: CreateUserType): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const { Security } = await import('../../core/security');
    const hashedPassword = await Security.hashPassword(data.password);

    const newUser = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    // Invalidate users cache when a new user is created
    await CacheService.delByPattern('users:*');

    await this.emailQueue.add('welcome-email', {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    return newUser;
  }

  async getPaginatedUsers(options: PaginateOptions): Promise<PaginatedResult<UserResponseDto>> {
    // Generate a unique cache key based on pagination/filtering options
    const cacheKey = `users:${JSON.stringify(options)}`;

    // Try to get data from cache first
    const cachedData = await CacheService.get<PaginatedResult<UserResponseDto>>(cacheKey);
    if (cachedData) return cachedData;

    // If not in cache, fetch from database
    const results = await this.userRepository.findAll(options);

    // Store in cache for 60 seconds (Cache-Aside pattern)
    await CacheService.set(cacheKey, results, CACHE_TTL_SECONDS);

    return results;
  }
}
