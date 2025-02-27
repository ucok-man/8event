import { AuthRegisterDTO } from '@/dto/auth-register.dto';
import { prismaclient } from '@/prisma';
import { PartialBy } from '@/types/helper';
import { User, VoucherStatus } from '@prisma/client';
import { z } from 'zod';

export class UserService {
  getById = async (userId: string, options?: { withPassword: boolean }) => {
    const user = await prismaclient.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password: options?.withPassword ? false : true,
      },
      include: {
        vouchers: {
          where: {
            status: VoucherStatus.NOT_USE,
          },
        },
      },
    });

    if (!user) return null;

    const pointBalances = await prismaclient.pointBalance.aggregate({
      _sum: {
        point: true,
      },
      where: {
        userId: user.id,
      },
    });

    const sum = pointBalances._sum.point || 0;
    if (sum < 0) {
      throw new Error('negative sum point balances result');
    }

    const rating = await prismaclient.recordOrganizerAverageRating.findUnique({
      where: {
        organizerId: user.id,
      },
    });

    return {
      ...user,
      pointBalance: sum,
      rating: rating?.averageRating || 0,
    };
  };

  getByEmail = async (email: string, options?: { withPassword: boolean }) => {
    const user = await prismaclient.user.findUnique({
      where: {
        email: email,
      },
      omit: {
        password: options?.withPassword ? false : true,
      },
      include: {
        vouchers: {
          where: {
            status: VoucherStatus.NOT_USE,
          },
        },
      },
    });

    if (!user) return null;

    const pointBalances = await prismaclient.pointBalance.aggregate({
      _sum: {
        point: true,
      },
      where: {
        userId: user.id,
      },
    });

    const sum = pointBalances._sum.point || 0;
    if (sum < 0) {
      throw new Error('negative sum point balances result');
    }

    const rating = await prismaclient.recordOrganizerAverageRating.findUnique({
      where: {
        organizerId: user.id,
      },
    });

    return {
      ...user,
      pointBalance: sum,
      rating: rating?.averageRating || 0,
    };
  };

  getByRefferalCode = async (
    referralCode: string,
    options?: { withPassword: boolean },
  ) => {
    const user = await prismaclient.user.findUnique({
      where: {
        referralCode: referralCode,
      },
      omit: {
        password: options?.withPassword ? false : true,
      },
      include: {
        vouchers: {
          where: {
            status: VoucherStatus.NOT_USE,
          },
        },
      },
    });

    if (!user) return null;

    const pointBalances = await prismaclient.pointBalance.aggregate({
      _sum: {
        point: true,
      },
      where: {
        userId: user.id,
      },
    });

    const sum = pointBalances._sum.point || 0;
    if (sum < 0) {
      throw new Error('negative sum point balances result');
    }

    const rating = await prismaclient.recordOrganizerAverageRating.findUnique({
      where: {
        organizerId: user.id,
      },
    });

    return {
      ...user,
      pointBalance: sum,
      rating: rating?.averageRating || 0,
    };
  };

  addPointBalance = async ({
    userId,
    amount,
  }: {
    userId: string;
    amount: number;
  }) => {
    if (amount < 0) throw new Error('negative amount point balance value');
    return await prismaclient.pointBalance.create({
      data: {
        point: amount,
        type: 'EARN',
        userId: userId,
      },
    });
  };

  addVoucher = async (param: {
    name: string;
    description: string;
    price: number;
    userId: string;
    expiredAt: Date;
  }) => {
    return await prismaclient.voucher.create({
      data: {
        ...param,
      },
    });
  };

  create = async (dto: Required<z.infer<typeof AuthRegisterDTO>>) => {
    const user = await prismaclient.user.create({
      data: dto,
    });
    return user as PartialBy<typeof user, 'password'>;
  };

  update = async (user: User) => {
    return await prismaclient.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        profilePicture: user.profilePicture,
        password: user.password,
      },
    });
  };
}
