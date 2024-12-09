import * as React from "react"
import { Resend } from "resend"

import { env } from "@/env"

const resend = new Resend(env.RESEND_API_KEY)

export async function sendEmail(
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

// TODO: implement me
// export async function batchSendEmails(
//   emails: {
//     to: string;
//     subject: string;
//     body: ReactNode;
//   }[]
// ) {
//   const { error } = await resend.batch.send(
//     emails.map((email) => ({
//       from: EMAIL_FROM,
//       to: email.to,
//       subject: email.subject,
//       react: email.body,
//     })
//   );
//   if (error) {
//     throw error;
//   }
// }
