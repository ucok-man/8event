import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '@/config';
import { currentDate, dateFrom } from '@/helpers/datetime-utils';
import { prismaclient } from '@/prisma';
import { addDays, isAfter } from 'date-fns';
import { sign } from 'jsonwebtoken';

export class JWTService {
  generateAuthNew = async (
    accessPayload: {
      id: string;
      name: string;
      email: string;
      profilePicture: string | null;
      role: 'ORGANIZER' | 'CUSTOMER';
    },
    refreshPayload: { email: string },
  ) => {
    // Access token valid for 15 minutes
    const accessToken = sign(accessPayload, JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });

    // Refresh token valid for 1 day
    const refreshToken = sign(refreshPayload, JWT_REFRESH_SECRET, {
      expiresIn: '1d',
    });

    const refreshExpiredAt = addDays(currentDate(), 1);

    await prismaclient.authToken.upsert({
      create: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        refreshExpiredAt: refreshExpiredAt,
        email: accessPayload.email,
      },
      where: {
        email: accessPayload.email,
      },
      update: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        refreshExpiredAt: refreshExpiredAt,
      },
    });

    return { accessToken, refreshToken, refreshExpiredAt };
  };

  generateAuthRefresh = async (email: string) => {
    const existingToken = await prismaclient.authToken.findUnique({
      where: {
        email: email,
      },
      include: {
        user: true,
      },
    });

    if (!existingToken) return null;

    const today = currentDate();
    const refreshExpiredAt = dateFrom(existingToken.refreshExpiredAt);

    // Check if refresh token is expired
    if (isAfter(today, refreshExpiredAt)) {
      return null; // unauthorized
    }

    // Generate new access token (15 minutes)
    const accessToken = sign(
      {
        id: existingToken.user.id,
        name: existingToken.user.name,
        email: existingToken.user.email,
        profilePicture: existingToken.user.profilePicture,
        role: existingToken.user.role,
      },
      JWT_ACCESS_SECRET,
      {
        expiresIn: '15m',
      },
    );

    // Generate new refresh token and extend expiration
    const newRefreshExpiredAt = addDays(today, 1);
    const refreshToken = sign(
      { email: existingToken.user.email },
      JWT_REFRESH_SECRET,
      {
        expiresIn: '1d',
      },
    );

    await prismaclient.authToken.update({
      where: {
        email: existingToken.user.email,
      },
      data: {
        refreshToken: refreshToken,
        accessToken: accessToken,
        refreshExpiredAt: newRefreshExpiredAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      refreshExpiredAt: newRefreshExpiredAt,
    };
  };
}
