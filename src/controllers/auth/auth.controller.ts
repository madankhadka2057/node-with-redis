import { Request, Response } from 'express';
import { AuthService } from '../../services/auth/auth.service';
import { catchAsync } from '../../core/catchAsync';
import { AppError } from '../../core/errors';
import { createUserSchema as registerSchema, loginUserSchema as loginSchema } from '../../validations/user/user.validation';


export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public register = catchAsync(async (req: Request, res: Response) => {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      throw new AppError(validation.error.issues[0].message, 400);
    }

    const result = await this.authService.register(validation.data);

    res.status(201).json({
      success: true,
      data: result,
    });
  });


  public login = catchAsync(async (req: Request, res: Response) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      throw new AppError(validation.error.issues[0].message, 400);
    }

    const result = await this.authService.login(validation.data);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  public refresh = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const result = await this.authService.refresh(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  public logout = catchAsync(async (req: Request, res: Response) => {
    // userId will be attached to req by auth middleware
    const userId = (req as any).user?.id;
    if (!userId) {
       throw new AppError('Unauthorized', 401);
    }

    await this.authService.logout(userId);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  });
}
