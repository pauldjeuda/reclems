import { env } from '../env';

type Mail = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  headers?: Record<string, string>;
  logText?: boolean;
};
export async function sendEmail(mail: Mail): Promise<void> {
  if (env.EMAIL_PROVIDER === 'console' || !env.EMAIL_API_KEY) {
    console.info(
      JSON.stringify({
        event: 'email.dev',
        to: mail.to.replace(/^(.).+(@.+)$/, '$1***$2'),
        subject: mail.subject,
        ...(mail.logText === false ? {} : { text: mail.text })
      })
    );
    return;
  }
  if (env.EMAIL_PROVIDER === 'resend') {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.EMAIL_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [mail.to],
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        reply_to: mail.replyTo,
        headers: mail.headers
      })
    });
    if (!response.ok) throw new Error('Email delivery failed');
    return;
  }
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.EMAIL_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { email: env.EMAIL_FROM.match(/<(.+)>/)?.[1] ?? env.EMAIL_FROM },
      to: [{ email: mail.to }],
      subject: mail.subject,
      textContent: mail.text,
      htmlContent: mail.html,
      replyTo: mail.replyTo ? { email: mail.replyTo } : undefined,
      headers: mail.headers
    })
  });
  if (!response.ok) throw new Error('Email delivery failed');
}
