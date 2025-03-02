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
    const accessToken = sign(accessPayload, JWT_ACCESS_SECRET, {
      expiresIn: '1m',
    });
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

    if (isAfter(today, refreshExpiredAt)) {
      return null; // unauthorized
    }

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
        expiresIn: '5s',
      },
    );
    const refreshToken = sign(
      { email: existingToken.user.email },
      JWT_REFRESH_SECRET,
      {
        expiresIn: `${refreshExpiredAt.getTime() - today.getTime()}ms`,
      },
    );

    await prismaclient.authToken.update({
      where: {
        email: existingToken.user.email,
      },
      data: {
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
    });

    return {
      accessToken,
      refreshToken,
      refreshExpiredAt,
    };
  };
}
