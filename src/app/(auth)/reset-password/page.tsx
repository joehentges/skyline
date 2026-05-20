import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResetPasswordForm } from "@/containers/reset-password-form";
import { database } from "@/db";
import { tokensTable } from "@/db/schemas";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage(props: ResetPasswordPageProps) {
  const { token } = await props.searchParams;

  if (!token) {
    return notFound();
  }

  const tokenRow = await database.query.tokensTable.findFirst({
    where: and(
      eq(tokensTable.token, token),
      eq(tokensTable.type, "password-reset")
    ),
  });

  if (!tokenRow || new Date() > tokenRow.expiresAt) {
    return notFound();
  }

  return (
    <div className="flex h-full flex-col justify-between space-y-8 px-4 py-8">
      <div className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-center font-bold text-2xl md:text-3xl">
            Reset Your Password
          </h2>
          <p className="text-center text-base">
            Change your password to something more memorable
          </p>
        </div>
        <ResetPasswordForm token={token} />

        <div>
          <p className="text-center">
            Remember your password?{" "}
            <Link className="text-primary hover:underline" href="/sign-in">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
