/**
 * emailService.ts
 * Envio de e-mails via EmailJS (funciona direto do browser, sem CORS)
 */

import emailjs from '@emailjs/browser';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE  as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE as string;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_KEY      as string;

interface SendEmailParams {
  to:              string;
  userName:        string;
  newPassword:     string;
  softwareName:    string;
  softwareEmail:   string;
  softwarePhone?:  string;
  softwareWebsite?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.error('[EmailJS] Variáveis VITE_EMAILJS_* não configuradas no .env');
    return false;
  }

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email:      params.to,
        user_name:     params.userName,
        new_password:  params.newPassword,
        software_name: params.softwareName,
        software_email: params.softwareEmail,
        software_phone: params.softwarePhone  ?? '',
        software_website: params.softwareWebsite ?? '',
      },
      PUBLIC_KEY
    );

    console.log('[EmailJS] Enviado:', result.status, result.text);
    return result.status === 200;
  } catch (e) {
    console.error('[EmailJS] Erro:', e);
    return false;
  }
}

/** Gera uma senha aleatória segura */
export function generatePassword(length = 10): string {
  const upper   = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower   = 'abcdefghjkmnpqrstuvwxyz';
  const digits  = '23456789';
  const special = '@#$!';
  const all     = upper + lower + digits + special;

  let password = '';
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += special[Math.floor(Math.random() * special.length)];

  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  return password.split('').sort(() => Math.random() - 0.5).join('');
}