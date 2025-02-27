import nodemailer from 'nodemailer';
import { SMTP_PASSWORD, SMTP_USER } from './config';

export const smtpclient = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});
