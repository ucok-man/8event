import { UpdateCurrentUserDTO } from '@/dto/update-current-user.dto';
import { FailedValidationError } from '@/errors/failed-validation.error';
import { ApiError } from '@/errors/interface';
import { InternalSeverError } from '@/errors/internal-server.error';
import { NotFoundError } from '@/errors/not-found.error';
import { formatErr } from '@/helpers/format-error';
import { getSessionAccess } from '@/helpers/session';
import { UserService } from '@/services/user.service';
import { compare, hash } from 'bcryptjs';
import { Request, Response } from 'express';

export class UserControllers {
  private userService = new UserService();

  getCurrentUser = async (req: Request, res: Response) => {
    const session = getSessionAccess(req);

    try {
      const user = await this.userService.getById(session.id);
      if (!user) {
        throw new NotFoundError();
      }
      res.status(200).json({
        user: user,
      });
    } catch (error) {
      if (!(error instanceof ApiError)) {
        const err = error as Error;
        throw new InternalSeverError(err.message);
      }
      throw error;
    }
  };

  updateCurrentUser = async (req: Request, res: Response) => {
    const session = getSessionAccess(req);

    const { data: dto, error } = UpdateCurrentUserDTO.safeParse(req.body);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const user = await this.userService.getById(session.id, {
        withPassword: true,
      });
      if (!user) throw new NotFoundError();

      if (dto.name) user.name = dto.name;
      if (dto.profilePicture) user.profilePicture = dto.profilePicture;
      if (dto.password) {
        const match = await compare(dto.password.current, user.password);
        if (!match)
          throw new FailedValidationError({
            current: {
              _error: 'Invalid value for current password',
            },
          });
        user.password = await hash(dto.password.new, 12);
      }

      const newuser = await this.userService.update(user);
      if (!user) {
        throw new NotFoundError();
      }

      res.status(200).json({
        user: newuser,
      });
    } catch (error) {
      if (!(error instanceof ApiError)) {
        const err = error as Error;
        throw new InternalSeverError(err.message);
      }
      throw error;
    }
  };
}
