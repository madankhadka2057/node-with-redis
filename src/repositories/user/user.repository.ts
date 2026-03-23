import { PrismaClient } from '@prisma/client';
import { CreateUserDto, UserResponseDto } from '../../types/user.types';
import { PaginatedResult, PaginateOptions } from '../../types/prisma.types';

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        phone: data.phone,
        addresse: data.addresse,
      },
    });
  }

  async findAll(options: PaginateOptions): Promise<PaginatedResult<UserResponseDto>> {
    return (this.prisma.user as any).paginate(options);
  }
}
