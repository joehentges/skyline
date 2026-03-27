import type * as React from "react";
import { resend } from "@/client/resend";
import { siteConfig } from "@/config/site";
import { MagicLinkEmail } from "@/emails/magic-link";
import { ResetPasswordEmail } from "@/emails/reset-password";
import { VerifyEmail } from "@/emails/verify-email";
import { env } from "@/env";

async function sendEmail(
  email: string,
  subject: string,
  body: React.ReactNode
) {
  if (env.DISABLE_EMAIL) {
    return;
  }

  const { error } = await resend.emails.send({
    from: env.RESEND_EMAIL_FROM,
    to: email,
    subject,
    react: <>{body}</>,
  });

  if (error) {
    throw error;
  }
}

export async function sendVerifyEmail(email: string, token: string) {
  await sendEmail(
    email,
    `Verify your email for ${siteConfig.name}`,
    <VerifyEmail token={token} />
  );
  if (env.DISABLE_EMAIL) {
    console.log(
      `OTP email verification sent to: ${email} with token: ${token}`
    );
  }
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const href = `${env.VERCEL_URL}/reset-password?token=${token}`;
  await sendEmail(
    email,
    `Your password reset link for ${siteConfig.name}`,
    <ResetPasswordEmail href={href} />
  );
  if (env.DISABLE_EMAIL) {
    console.log(
      `Password reset link sign in sent to: ${email} with link: ${href}`
    );
  }
}

export async function sendMagicLinkEmail(email: string, token: string) {
  const href = `${env.VERCEL_URL}/api/auth/magic?token=${token}`;
  await sendEmail(
    email,
    `Your magic link link for ${siteConfig.name}`,
    <MagicLinkEmail href={href} />
  );
  if (env.DISABLE_EMAIL) {
    console.log(`Magic link sign in sent to: ${email} with link: ${href}`);
  }
}
