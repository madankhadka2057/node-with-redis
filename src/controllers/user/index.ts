import { prisma } from '../../core/prisma';
import { emailQueue } from '../../queues/email.queue';
import { UserRepository } from '../../repositories/user/user.repository';
import { UserService } from '../../services/user/user.service';
import { UserController } from './user.controller';

// Dependency injection container for User module
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository, emailQueue);
export const userController = new UserController(userService);
