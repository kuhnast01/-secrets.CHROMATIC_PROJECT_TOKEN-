import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import axios from 'axios';

const prisma = new PrismaClient();
const auditLogPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../store_items/enemy_templates/audit.log');

const EMAIL_RECIPIENT = process.env.AUDIT_NOTIFICATION_EMAIL || 'admin@example.com';
const WEBHOOK_URL = process.env.AUDIT_NOTIFICATION_WEBHOOK || '';

async function logChange(templateId: string, change: string) {
  const timestamp = new Date().toISOString();
  const entry = `${timestamp} | ${templateId} | ${change}\n`;
  fs.appendFileSync(auditLogPath, entry);
  await prisma.auditLog.create({
    data: {
      templateId,
      change,
      timestamp
    }
  });
}

async function sendEmailNotification(templateId: string, change: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  await transporter.sendMail({
    from: 'noreply@game.com',
    to: EMAIL_RECIPIENT,
    subject: `Enemy Template Change: ${templateId}`,
    text: `Change: ${change}`
  });
}

async function sendWebhookNotification(templateId: string, change: string) {
  if (!WEBHOOK_URL) return;
  await axios.post(WEBHOOK_URL, {
    templateId,
    change,
    timestamp: new Date().toISOString()
  });
}

export async function notifyChange(templateId: string, change: string) {
  await logChange(templateId, change);
  await sendEmailNotification(templateId, change);
  await sendWebhookNotification(templateId, change);
  console.log(`BADASS notification sent for ${templateId}: ${change}`);
}
