import * as React from "react"
import { MagicLinkEmail } from "@/emails/magic-link"
import { ResetPasswordEmail } from "@/emails/reset-password"
import { VerifyEmail } from "@/emails/verify-email"

import { env } from "@/env"
import { siteConfig } from "@/config/site"
import { resend } from "@/client/resend"

async function sendEmail(
  email: string,
  subject: string,
  body: React.ReactNode
) {
  const { error } = await resend.emails.send({
    from: env.RESEND_EMAIL_FROM,
    to: email,
    subject,
    react: <>{body}</>,
  })

  if (error) {
    throw error
  }
}

export async function sendVerifyEmail(email: string, token: string) {
  await sendEmail(
    email,
    `Verify your email for ${siteConfig.name}`,
    <VerifyEmail token={token} />
  )
}

export async function sendResetPasswordEmail(email: string, token: string) {
  await sendEmail(
    email,
    `Your password reset link for ${siteConfig.name}`,
    <ResetPasswordEmail token={token} />
  )
}

export async function sendMagicLinkEmail(email: string, token: string) {
  await sendEmail(
    email,
    `Your magic link link for ${siteConfig.name}`,
    <MagicLinkEmail token={token} />
  )
}
