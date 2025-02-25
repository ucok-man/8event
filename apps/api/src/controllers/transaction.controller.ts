import { CheckoutTransactionDTO } from '@/dto/checkout-transaction.dto';
import { GetTransactionByUserIdDTO } from '@/dto/get-transaction-by-userid.dto';
import { UpdatePaymentProofDTO } from '@/dto/update-payment-proof.dto';
import { UpdateTransactionDTO } from '@/dto/update-transaction.dto';
import { FailedValidationError } from '@/errors/failed-validation.error';
import { ApiError } from '@/errors/interface';
import { InternalSeverError } from '@/errors/internal-server.error';
import { NotFoundError } from '@/errors/not-found.error';
import { formatErr } from '@/helpers/format-error';
import { TransactionService } from '@/services/transaction.service';
import { TransactionStatus } from '@prisma/client';
import { Request, Response } from 'express';

export class TransactionControllers {
  private transactionService = new TransactionService();

  checkout = async (req: Request, res: Response) => {
    const { data: dto, error } = CheckoutTransactionDTO.safeParse(req.body);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const transaction = await this.transactionService.checkout(dto);
      if (transaction.priceAfterDiscount > 0) {
        res.status(200).json({ transaction, status: 'NEED_PAYMENT' });
        return;
      }

      // If reach this path this means ticket is free or payment covered full
      // by discount
      transaction.status = TransactionStatus.COMPLETED;
      transaction.expiredAt = null;
      const updated = await this.transactionService.update(transaction);
      // TODO: send smptp mailer
      res.status(200).json({ transaction: updated, status: 'COMPLETED' });
    } catch (error) {
      if (!(error instanceof ApiError)) {
        const err = error as Error;
        throw new InternalSeverError(err.message);
      }
      throw error;
    }
  };

  getByUserId = async (req: Request, res: Response) => {
    const { data: dto, error } = GetTransactionByUserIdDTO.safeParse({
      userId: req.params.userId,
      status: req.query.status,
    });
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const transaction = await this.transactionService.getByUserId(dto);
      if (!transaction) throw new NotFoundError();
      res.status(200).json({ transaction });
    } catch (error) {
      if (!(error instanceof ApiError)) {
        const err = error as Error;
        throw new InternalSeverError(err.message);
      }
      throw error;
    }
  };

  update = async (req: Request, res: Response) => {
    const { data: dto, error } = UpdateTransactionDTO.safeParse({
      transactionId: req.params.transactionId,
      ...req.body,
    });
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const transaction = await this.transactionService.getById(
        dto.transactionId,
      );
      if (!transaction) throw new NotFoundError();

      if (dto.isPayed) transaction.isPayed = dto.isPayed;

      const updated = await this.transactionService.update(transaction);
      res.status(200).json({ transaction: updated });
    } catch (error) {
      if (!(error instanceof ApiError)) {
        const err = error as Error;
        throw new InternalSeverError(err.message);
      }
      throw error;
    }
  };

  updatePaymentProof = async (req: Request, res: Response) => {
    const { data: dto, error } = UpdatePaymentProofDTO.safeParse({
      transactionId: req.params.transactionId,
      ...req.body,
    });
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const transaction = await this.transactionService.getById(
        dto.transactionId,
      );
      if (!transaction) throw new NotFoundError();

      transaction.paymentProof = dto.paymentProof;
      transaction.expiredAt = null;
      transaction.status = TransactionStatus.WAITING_CONFIRMATION;
      const updated = await this.transactionService.update(transaction);

      //TODO: SEND SMTP MAILER

      res.status(200).json({ transaction: updated });
    } catch (error) {
      if (!(error instanceof ApiError)) {
        const err = error as Error;
        throw new InternalSeverError(err.message);
      }
      throw error;
    }
  };
}
