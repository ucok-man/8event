import { CheckoutTransactionDTO } from '@/dto/checkout-transaction.dto';
import { FailedValidationError } from '@/errors/failed-validation.error';
import { InternalSeverError } from '@/errors/internal-server.error';
import { formatErr } from '@/helpers/format-error';
import { TransactionService } from '@/services/transaction.service';
import { Request, Response } from 'express';

export class TransactionControllers {
  private transactionService = new TransactionService();

  checkout = async (req: Request, res: Response) => {
    const { data: dto, error } = CheckoutTransactionDTO.safeParse(req.body);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const result = await this.transactionService.checkout(dto);
      res.status(200).json({ ...result });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalSeverError(error.message);
      }
      throw error;
    }
  };
}
