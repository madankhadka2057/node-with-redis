import { Resend } from 'resend';
import { config } from './config';
import { getWelcomeTemplate } from '../templates/email/welcome.template';

class Mailer {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(config.mail.resend.apiKey);
    console.log('[Mailer] Resend Service Initialized');
  }

  public async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const html = getWelcomeTemplate(name);

    const { data, error } = await this.resend.emails.send({
      from: config.mail.resend.from,
      to,
      subject: 'Welcome to Our Professional Node.js Platform! 🚀',
      html,
    });

    if (error) {
      console.error('[Mailer] Resend Error:', error.message);
      throw new Error(`Failed to send email via Resend: ${error.message}`);
    }

    console.log('[Mailer] Email sent successfully via Resend. ID:', data?.id);
  }
}

export const mailer = new Mailer();
