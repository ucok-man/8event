import { GetUserByIdDTO } from '@/dto/get-user-by-id.dto';
import { FailedValidationError } from '@/errors/failed-validation.error';
import { InternalSeverError } from '@/errors/internal-server.error';
import { NotFoundError } from '@/errors/not-found.error';
import { formatErr } from '@/helpers/format-error';
import { UserService } from '@/services/user.service';
import { Request, Response } from 'express';

export class UserControllers {
  private userService = new UserService();

  // TODO: get current login user instead of from req param!!!
  getById = async (req: Request, res: Response) => {
    const { data: dto, error } = GetUserByIdDTO.safeParse(req.params);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const user = await this.userService.getById(dto.userId);
      if (!user) {
        throw new NotFoundError();
      }
      res.status(200).json({
        user: user,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalSeverError(error.message);
      }
      throw error;
    }
  };
}
