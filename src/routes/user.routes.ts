import { Router } from 'express';
import { userController } from '../controllers/user';

const router = Router();

// Route definition - validation is now handled inside the controller
router.post('/', userController.register);
router.get('/', userController.getUsers);

export default router
