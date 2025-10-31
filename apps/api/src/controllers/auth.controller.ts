import { JWT_REFRESH_SECRET, NODE_ENV } from '@/config';
import { AuthLoginDTO } from '@/dto/auth-login.dto';
import { AuthRegisterDTO } from '@/dto/auth-register.dto';
import { FailedValidationError } from '@/errors/failed-validation.error';
import { ApiError } from '@/errors/interface';
import { InternalSeverError } from '@/errors/internal-server.error';
import { InvalidAuthTokenError } from '@/errors/invalid-auth-token.error';
import { InvalidCredentialError } from '@/errors/invalid-credential.error';
import { currentDate } from '@/helpers/datetime-utils';
import { formatErr } from '@/helpers/format-error';
import { generateReferralCode } from '@/helpers/generate-referral-code';
import { JWTService } from '@/services/jwt.service';
import { UserService } from '@/services/user.service';
import bcrypt, { compare } from 'bcryptjs';
import { addMonths } from 'date-fns';
import { Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

export class AuthControllers {
  private userService = new UserService();
  private jwtService = new JWTService();

  register = async (req: Request, res: Response) => {
    const { data: dto, error } = AuthRegisterDTO.safeParse(req.body);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      if (await this.userService.getByEmail(dto.email)) {
        throw new FailedValidationError({
          email: {
            _errors: 'User with this email already exists',
          },
        });
      }

      let addVoucher = false;
      if (dto.referralCode) {
        const referred = await this.userService.getByRefferalCode(
          dto.referralCode,
        );
        if (!referred || (referred && referred.role === 'ORGANIZER'))
          throw new FailedValidationError({
            referralCode: {
              _errors: 'Referral code did not exists',
            },
          });
        addVoucher = true;
        await this.userService.addPointBalance({
          userId: referred.id,
          amount: 10_000,
        });
      }

      const hashpassword = await bcrypt.hash(dto.password, 12);
      const user = await this.userService.create({
        email: dto.email,
        name: dto.name,
        password: hashpassword,
        referralCode: generateReferralCode(),
        role: dto.role,
      });

      if (addVoucher) {
        const tigaBulanKedepan = addMonths(currentDate(), 3);

        await this.userService.addVoucher({
          name: 'Referral Rewards',
          price: 10000,
          expiredAt: tigaBulanKedepan,
          description: 'Get Rp10.000 off the next time you purchase!',
          userId: user.id,
        });
      }

      delete user['password'];
      res.status(201).json({
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

  login = async (req: Request, res: Response) => {
    const { data: dto, error } = AuthLoginDTO.safeParse(req.body);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const user = await this.userService.getByEmail(dto.email, {
        withPassword: true,
      });
      if (!user) throw new InvalidCredentialError();
      if (user.role !== dto.role) throw new InvalidCredentialError();

      const match = await compare(dto.password, user.password);
      if (!match) throw new InvalidCredentialError();

      const token = await this.jwtService.generateAuthNew(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          role: user.role,
        },
        { email: user.email },
      );

      res.cookie('jwt-token', token.refreshToken, {
        httpOnly: true, // cannot access in javascript
        secure: NODE_ENV === 'development' ? false : true, // https only
        sameSite: NODE_ENV === 'development' ? 'lax' : 'none', // allow cross site cookie
        path: '/',
        // domain: NODE_ENV === 'development' ? undefined : FRONTEND_URL,
        expires: token.refreshExpiredAt,
      });

      res.status(200).json({ accessToken: token.accessToken });
    } catch (error) {
      if (!(error instanceof ApiError)) {
        const err = error as Error;
        throw new InternalSeverError(err.message);
      }
      throw error;
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies['jwt-token']) throw new InvalidAuthTokenError();

    try {
      const refreshToken = cookies['jwt-token'];
      let session: (JwtPayload & { email: string }) | string;
      try {
        session = verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload & {
          email: string;
        };
      } catch (error) {
        throw new InvalidAuthTokenError();
      }

      const token = await this.jwtService.generateAuthRefresh(session.email);
      if (!token) throw new InvalidAuthTokenError();

      res.cookie('jwt-token', token.refreshToken, {
        httpOnly: true, // cannot access in javascript
        secure: NODE_ENV === 'development' ? false : true, // https only
        sameSite: NODE_ENV === 'development' ? 'lax' : 'none', // allow cross site cookie
        path: '/',
        // domain: NODE_ENV === 'development' ? undefined : FRONTEND_URL,
        expires: token.refreshExpiredAt,
      });

      res.status(200).json({
        accessToken: token.accessToken,
      });
    } catch (error) {
      if (!(error instanceof ApiError)) {
        const err = error as Error;
        throw new InternalSeverError(err.message);
      }
      throw error;
    }
  };

  logout = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies['jwt-token']) {
      res.status(204).json({});
      return;
    }
    res.clearCookie('jwt-token', {
      httpOnly: true, // cannot access in javascript
      secure: NODE_ENV === 'development' ? false : true, // https only
      sameSite: NODE_ENV === 'development' ? 'lax' : 'none', // allow cross site cookie
      path: '/',
      // domain: NODE_ENV === 'development' ? undefined : FRONTEND_URL,
    });
    res.status(204).json({});
  };

  identity = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies['jwt-token']) throw new InvalidAuthTokenError();
    try {
      const refreshToken = cookies['jwt-token'];
      let session: (JwtPayload & { email: string }) | string;
      try {
        session = verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload & {
          email: string;
        };
      } catch (error) {
        throw new InvalidAuthTokenError();
      }
      const user = await this.userService.getByEmail(session.email);
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
}
