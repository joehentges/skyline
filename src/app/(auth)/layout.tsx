import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { AFTER_SIGN_IN_URL } from "@/config";
import { getCurrentUser } from "@/lib/session";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) {
    redirect(AFTER_SIGN_IN_URL);
  }

  return (
    <div className="flex">
      <div className="hidden w-3/5 bg-muted-foreground/20 p-10 md:block">
        <Link className="inline-block" href="/">
          <Logo />
        </Link>
      </div>

      <main className="flex min-h-screen w-full items-center justify-center">
        <div className="w-full max-w-128 p-4">
          <div className="flex justify-center md:hidden">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
