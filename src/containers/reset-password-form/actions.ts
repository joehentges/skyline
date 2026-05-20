"use server";

import argon2 from "argon2";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { SIGN_IN_URL } from "@/config";
import { database } from "@/db";
import { tokensTable, usersTable } from "@/db/schemas";
import { rateLimitByKey } from "@/lib/limiter";
import { unauthenticatedAction } from "@/lib/safe-action";

import { resetPasswordFormSchema } from "./validation";

export const resetPasswordAction = unauthenticatedAction
  .inputSchema(resetPasswordFormSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByKey({
      key: `${parsedInput.token}-reset-password`,
      limit: 3,
      window: 10_000,
    });

    const tokenRow = await database.query.tokensTable.findFirst({
      where: and(
        eq(tokensTable.token, parsedInput.token),
        eq(tokensTable.type, "password-reset")
      ),
    });

    if (!tokenRow) {
      throw new Error("Invalid token");
    }

    if (new Date() > tokenRow.expiresAt) {
      throw new Error("Token has expired");
    }

    const user = await database.query.usersTable.findFirst({
      where: eq(usersTable.email, tokenRow.email),
    });

    if (!user) {
      throw new Error("User not found");
    }

    const passwordHash = await argon2.hash(parsedInput.password);

    await database
      .update(usersTable)
      .set({ passwordHash })
      .where(eq(usersTable.id, user.id));

    await database
      .delete(tokensTable)
      .where(
        and(
          eq(tokensTable.token, parsedInput.token),
          eq(tokensTable.type, "password-reset")
        )
      );

    redirect(SIGN_IN_URL);
  });
