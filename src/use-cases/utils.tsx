import { MagicLinkEmail } from "@/emails/magic-link"
import { ResetPasswordEmail } from "@/emails/reset-password"
import { VerifyEmail } from "@/emails/verify-email"

import { siteConfig } from "@/config/site"
import { sendEmail } from "@/lib/send-email"

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

export async function sendMagicLinkEmail(
  email: string,
  token: string,
  from?: string
) {
  await sendEmail(
    email,
    `Your magic link link for ${siteConfig.name}`,
    <MagicLinkEmail token={token} from={from} />
  )
}
