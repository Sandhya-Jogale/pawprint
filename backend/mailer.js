import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // The 16-character App Password
  },
});

/**
 * Sends an email using the configured SMTP server
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML email body
 */
export const sendMail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.warn("⚠️ Email credentials not found in .env. Skipping real email dispatch.");
      return false;
    }

    const info = await transporter.sendMail({
      from: `"PawPrint Alerts" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`📧 Real Email dispatched to ${to}! Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending real email:", error);
    return false;
  }
};
