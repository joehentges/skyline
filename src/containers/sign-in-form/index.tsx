"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { LoaderButton } from "@/components/loader-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { signInAction } from "./actions";
import { signInFormSchema } from "./validation";

export function SignInForm() {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
      staySignedIn: false,
    },
  });

  const { execute, result, isPending, hasErrored } = useAction(signInAction, {
    onError({ error }) {
      toast.error("Something went wrong", {
        description: error.serverError,
      });
    },
    onSuccess() {
      // store email in localstorage
      toast.success("Let's Go!", {
        description: "Enjoy your session",
      });
    },
  });

  function onSubmit(values: z.infer<typeof signInFormSchema>) {
    execute(values);
  }

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        {hasErrored && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Uhoh, we couldn&apos;t log you in</AlertTitle>
            <AlertDescription>{result.serverError}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  placeholder="jsmith@email.com"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  placeholder="••••••••••"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between pt-4">
          <LoaderButton
            className="px-12"
            isLoading={isPending}
            size="lg"
            type="submit"
          >
            Login
          </LoaderButton>
          <Link href="/forgot-password">
            <Button variant="link">Forgot password?</Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
