import { JWT_ACCESS_SECRET } from '@/config';
import { InvalidAuthTokenError } from '@/errors/invalid-auth-token.error';
import { UnauthorizedError } from '@/errors/unauthorized.error';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

export const withAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;

    // Check if authorization header exists and has Bearer format
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new InvalidAuthTokenError();
    }

    const token = authorization.split('Bearer ')[1];

    let session: JwtPayload | string;
    try {
      session = verify(token, JWT_ACCESS_SECRET);
    } catch (error) {
      throw new InvalidAuthTokenError();
    }

    if (!session) throw new InvalidAuthTokenError();

    req['user'] = session as JwtPayload & {
      id: string;
      name: string;
      email: string;
      profilePicture: string;
      role: 'CUSTOMER' | 'ORGANIZER';
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const withRole =
  (role: 'ORGANIZER' | 'CUSTOMER') =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req['user'] || req['user'].role !== role) {
        throw new UnauthorizedError();
      }
      next();
    } catch (error) {
      next(error);
    }
  };
