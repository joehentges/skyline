"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Terminal } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Captcha } from "@/components/captcha";
import { LoaderButton } from "@/components/loader-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";
import { PasswordFormFields } from "@/containers/password-form-fields";
import { env } from "@/env";
import { reviewAndPasswordFormSchema } from "./validation";

interface ReviewAndPasswordFormProps {
  errorMessage?: string;
  hasErrored?: boolean;
  isPending: boolean;
  onSubmit: (values: z.infer<typeof reviewAndPasswordFormSchema>) => void;
}

export function ReviewAndPasswordForm(props: ReviewAndPasswordFormProps) {
  const { onSubmit, isPending, hasErrored, errorMessage } = props;
  const form = useForm<z.infer<typeof reviewAndPasswordFormSchema>>({
    resolver: zodResolver(reviewAndPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        {hasErrored && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Uhoh, we couldn&apos;t sign you up</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <PasswordFormFields form={form} />

        {!env.NEXT_PUBLIC_DISABLE_TURNSTILE && (
          <Captcha
            onSuccess={(token) => form.setValue("captchaToken", token)}
            validationerror={form.formState.errors.captchaToken?.message}
          />
        )}

        <div className="pt-2">
          <LoaderButton
            className="w-full"
            isLoading={isPending}
            size="lg"
            type="submit"
          >
            Sign up
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
}
