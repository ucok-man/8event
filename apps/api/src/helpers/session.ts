import { UnauthenticatedError } from '@/errors/unauthenticated.error';
import { UnauthorizedError } from '@/errors/unauthorized.error';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export function getSessionAccess(req: Request) {
  if (!req['user']) throw new UnauthenticatedError();
  return req['user'] as JwtPayload & {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
    role: 'CUSTOMER' | 'ORGANIZER';
  };
}
export function getSessionOrganizer(req: Request) {
  const user = getSessionAccess(req);
  if (user.role !== 'ORGANIZER') throw new UnauthorizedError();
  return { ...user, role: 'ORGANIZER' };
}

export function getSessionCustomer(req: Request) {
  const user = getSessionAccess(req);
  if (user.role !== 'CUSTOMER') throw new UnauthorizedError();
  return { ...req['user'], role: 'CUSTOMER' };
}
