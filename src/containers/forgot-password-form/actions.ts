"use server";

import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { TOKEN_TTL } from "@/config";
import { database } from "@/db";
import { tokensTable, usersTable } from "@/db/schemas";
import { rateLimitByKey } from "@/lib/limiter";
import { unauthenticatedAction } from "@/lib/safe-action";
import { sendResetPasswordEmail } from "@/lib/send-email";

import { forgotPasswordFormSchema } from "./validation";

export const sendForgotPasswordAction = unauthenticatedAction
  .inputSchema(forgotPasswordFormSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByKey({
      key: `${parsedInput.email}-send-forgot-password`,
      limit: 3,
      window: 10_000,
    });

    const user = await database.query.usersTable.findFirst({
      where: eq(usersTable.email, parsedInput.email),
    });

    if (!user) {
      throw new Error("Email address not found");
    }

    const verificationToken = createId();
    const expiresAt = new Date(Date.now() + TOKEN_TTL.PASSWORD_RESET_EMAIL);

    await database.insert(tokensTable).values({
      token: verificationToken,
      type: "password-reset",
      email: parsedInput.email,
      expiresAt,
    });

    await sendResetPasswordEmail(parsedInput.email, verificationToken);
  });
