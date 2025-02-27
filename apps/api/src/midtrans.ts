//@ts-nocheck
import MidtransClient from 'midtrans-client';
import { MIDTRANS_SERVER_KEY } from './config';

export const midtransSnap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
});
