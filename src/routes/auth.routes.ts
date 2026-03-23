import { Router } from 'express';
import { AuthController } from '../controllers/auth/auth.controller';
import { AuthService } from '../services/auth/auth.service';
import { UserRepository } from '../repositories/user/user.repository';
import { prisma } from '../core/prisma';
import { protect } from '../middlewares/auth.middleware';

const router = Router();
const userRepository = new UserRepository(prisma);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/refresh', authController.refresh);
router.post('/logout', protect, authController.logout);

export default router;
