import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/user/user.service';
import { AppError } from '../../core/errors';
import { createUserSchema } from '../../validations/user/user.validation';
import { catchAsync } from '../../core/catchAsync';

export class UserController {
  constructor(private readonly userService: UserService) { }

  public register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    // Validate request body using Zod
    const validation = createUserSchema.safeParse(req.body);

    if (!validation.success) {
      throw new AppError(validation.error.issues[0].message, 400);
    }

    const newUser = await this.userService.registerUser(validation.data);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  });

  public getUsers = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { page, limit, where, orderBy, include, select } = req.query;
    const params = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      where: where ? (typeof where === 'string' ? JSON.parse(where) : where) : undefined,
      orderBy: orderBy ? (typeof orderBy === 'string' ? JSON.parse(orderBy) : orderBy) : undefined,
      include: include ? (typeof include === 'string' ? JSON.parse(include) : include) : undefined,
      select: select ? (typeof select === 'string' ? JSON.parse(select) : select) : undefined,
    }
    const results = await this.userService.getPaginatedUsers(params);

    res.status(200).json({
      success: true,
      ...results,
    });
  });
}
