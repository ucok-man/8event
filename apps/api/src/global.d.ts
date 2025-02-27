/** @format */
export {};

import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    export interface Request {
      user?:
        | (JwtPayload & {
            id: string;
            name: string;
            email: string;
            profilePicture: string;
            role: 'CUSTOMER' | 'ORGANIZER';
          })
        | (JwtPayload & { email: string });
    }
  }
}
