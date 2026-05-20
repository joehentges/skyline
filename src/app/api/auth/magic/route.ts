import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { AFTER_SIGN_IN_URL, SIGN_IN_URL } from "@/config";
import { database } from "@/db";
import { tokensTable, usersTable } from "@/db/schemas";
import { rateLimitByIp } from "@/lib/limiter";
import { getCurrentUser, setSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await rateLimitByIp({ key: "magic-token", limit: 5, window: 60_000 });

    const existingSession = await getCurrentUser();

    if (existingSession) {
      return new NextResponse(null, {
        status: 302,
        headers: {
          Location: AFTER_SIGN_IN_URL,
        },
      });
    }

    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new NextResponse(null, {
        status: 302,
        headers: {
          Location: SIGN_IN_URL,
        },
      });
    }

    const tokenRow = await database.query.tokensTable.findFirst({
      where: and(
        eq(tokensTable.token, token),
        eq(tokensTable.type, "magic-link")
      ),
    });

    if (!tokenRow) {
      throw new Error("Invalid token");
    }

    if (new Date() > tokenRow.expiresAt) {
      throw new Error("Token has expired");
    }

    const existingUser = await database.query.usersTable.findFirst({
      where: eq(usersTable.email, tokenRow.email),
    });

    if (!existingUser) {
      return new NextResponse(null, {
        status: 302,
        headers: {
          Location: "/sign-up",
        },
      });
    }

    const [user] = await database
      .update(usersTable)
      .set({
        emailVerified: new Date(),
      })
      .where(eq(usersTable.id, existingUser.id))
      .returning();

    await setSession(user.id, "magic-link");

    await database
      .delete(tokensTable)
      .where(
        and(eq(tokensTable.token, token), eq(tokensTable.type, "magic-link"))
      );

    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: AFTER_SIGN_IN_URL,
      },
    });
  } catch (error: unknown) {
    console.error("api/auth/magic - error", error);
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: "/sign-in/magic/error",
      },
    });
  }
}
