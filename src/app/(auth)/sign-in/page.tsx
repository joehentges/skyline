import { WandSparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInForm } from "@/containers/sign-in-form";

export default async function SignInPage() {
  return (
    <div className="flex h-full flex-col justify-between space-y-8 px-4 py-8">
      <div className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-center font-bold text-2xl md:text-3xl">
            Welcome Back
          </h2>
          <p className="text-center text-base">
            Enter your email and password to access your account
          </p>
        </div>
        <SignInForm />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <Link href="/sign-in/magic">
          <Button className="w-full" size="sm" type="submit" variant="outline">
            <WandSparkles className="mr-2 h-4 w-4" /> Magic Link
          </Button>
        </Link>
      </div>

      <div>
        <p className="text-center">
          Don&apos;t have an account?{" "}
          <Link className="text-primary hover:underline" href="/sign-up">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
