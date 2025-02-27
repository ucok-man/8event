import { smtpclient } from '@/smtp';
import path from 'path';
import pug from 'pug';

export class SMTPService {
  compile = (filename: string, data: any) => {
    const tmplpath = path.join(__dirname, '../templates', filename);
    const template = pug.compileFile(tmplpath);
    const html = template(data);
    return html;
  };

  sendMail = ({ to, subject, html }: SendMailProp) => {
    smtpclient.sendMail({ to, subject, html });
  };

  send = (prop: SendProp) => {
    const html = this.compile(prop.template, prop.data);
    return this.sendMail({
      to: prop.to,
      subject: prop.subject,
      html: html,
    });
  };
}

type SendMailProp = {
  to: string;
  subject: string;
  html: string;
};

type SendProp =
  | {
      to: string;
      subject: string;
      template: 'customer-payment-pending.pug';
      data: {
        title: 'Donation In Progress';
        receiver: string;
        event: {
          name: string;
          tickets: { name: string; quantity: number }[];
          donation: string;
        };
      };
    }
  | {
      to: string;
      subject: string;
      template: 'organizer-payment-pending.pug';
      data: {
        title: 'New Transaction';
        receiver: string;
        event: {
          name: string;
          buyer: string;
          tickets: { name: string; quantity: number }[];
          totalPrice: string;
        };
      };
    }
  | {
      to: string;
      subject: string;
      template: 'accept-payment.pug';
      data: {
        title: 'Donation Accepted';
        receiver: string;
      };
    }
  | {
      to: string;
      subject: string;
      template: 'cancel-payment.pug';
      data: {
        title: 'Donation Rejected';
        receiver: string;
      };
    };
