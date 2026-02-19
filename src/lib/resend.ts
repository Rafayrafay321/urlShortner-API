import { Resend } from 'resend';
// Custom imports
import { gethtmlFromMjml } from './getHtmlFromMjml';
import config from '@/config/config';
import logger from './winston';

const resend = new Resend(config.RESEND_API_KEY);

export const sendPasswordResetEmail = async (
  recipientEmail: string,
  resetLink: string,
  recipientName: string,
) => {
  const emailHtmlBody = gethtmlFromMjml('password-reset', {
    name: recipientName,
    resetLink,
  });
  try {
    await resend.emails.send({
      from: config.EMAIL_FROM || 'onboarding@resend.dev',
      to: recipientEmail,
      subject: 'Your Password Reset Link',
      html: emailHtmlBody,
    });
    logger.info('Password reset email sent successfully. ');
  } catch (error) {
    logger.error('Error sending password reset email', error);
    throw new Error('Could not send password reset email');
  }
};
