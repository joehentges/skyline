"use server";

import { createId } from "@paralleldrive/cuid2";
import { TOKEN_TTL } from "@/config";
import { database } from "@/db";
import { tokensTable } from "@/db/schemas";
import { rateLimitByKey } from "@/lib/limiter";
import { unauthenticatedAction } from "@/lib/safe-action";
import { sendMagicLinkEmail } from "@/lib/send-email";

import { magicLinkFormSchema } from "./validation";

export const sendMagicLinkAction = unauthenticatedAction
  .inputSchema(magicLinkFormSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByKey({
      key: `${parsedInput.email}-send-magic-link`,
      limit: 3,
      window: 10_000,
    });

    const magicLinkToken = createId();
    const expiresAt = new Date(Date.now() + TOKEN_TTL.MAGIC_LINK_EMAIL);

    await database.insert(tokensTable).values({
      token: magicLinkToken,
      type: "magic-link",
      email: parsedInput.email,
      expiresAt,
    });

    await sendMagicLinkEmail(parsedInput.email, magicLinkToken);
  });
