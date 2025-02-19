import { prismaclient } from '@/prisma';
import { VoucherStatus } from '@prisma/client';

export class UserService {
  getById = async (userId: string) => {
    const user = await prismaclient.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password: true,
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

    return {
      ...user,
      pointBalance: sum,
    };
  };
}
