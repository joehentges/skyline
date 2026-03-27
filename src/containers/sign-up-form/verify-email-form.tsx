"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TerminalIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { LoaderButton } from "@/components/loader-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { sendEmailVerificationCodeAction, verifyEmailAction } from "./actions";
import { verifyEmailFormSchema } from "./validation";

interface VerifyEmailFormProps {
  email: string;
  onVerifyEmailFormSubmit: () => void;
}

export function VerifyEmailForm(props: VerifyEmailFormProps) {
  const { onVerifyEmailFormSubmit, email } = props;

  const [canResend, setCanResend] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(60);

  const form = useForm<z.infer<typeof verifyEmailFormSchema>>({
    resolver: zodResolver(verifyEmailFormSchema),
    defaultValues: {
      email,
      token: "",
    },
  });

  const { execute, result, isPending, hasErrored } = useAction(
    verifyEmailAction,
    {
      onError({ error }) {
        toast.error("Something went wrong", {
          description: error.serverError,
        });
      },
      onSuccess({ data }) {
        onVerifyEmailFormSubmit();
        toast.success("Email verification!", {
          description: (
            <p>
              We successfully verified your{" "}
              <b className="font-bold">{data.email}</b> email address.
            </p>
          ),
        });
      },
    }
  );

  const {
    execute: executeResend,
    result: rseendResult,
    isPending: resendIsPending,
    hasErrored: resendHasErrored,
  } = useAction(sendEmailVerificationCodeAction, {
    onError({ error }) {
      toast.error("Something went wrong", {
        description: error.serverError,
      });
    },
    onSuccess({ data }) {
      setCanResend(false);
      toast.success("Email verification code sent!", {
        description: (
          <p>
            Check your email <b className="font-bold">{data.email}</b> and enter
            the code.
          </p>
        ),
      });
    },
  });

  function onSubmit(values: z.infer<typeof verifyEmailFormSchema>) {
    execute(values);
  }

  function onResendClicked() {
    executeResend({ email });
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!canResend && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setCanResend(true);
      setSeconds(60);
    }

    // Cleanup function to clear the interval
    return () => clearInterval(timer);
  }, [canResend, seconds]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-center gap-y-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="text-center font-medium text-lg">Email verification</p>

        {(hasErrored || resendHasErrored) && (
          <Alert variant="destructive">
            <TerminalIcon className="h-4 w-4" />
            <AlertTitle>Uhoh, we couldn&apos;t continue</AlertTitle>
            <AlertDescription>
              {result.serverError || rseendResult.serverError}
            </AlertDescription>
          </Alert>
        )}

        <Input
          className="w-[265px] place-self-center text-center"
          disabled
          value={email}
        />

        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center text-center">
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the verification code sent to your email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoaderButton
          className="cursor-pointer"
          disabled={!canResend}
          isLoading={resendIsPending}
          onClick={onResendClicked}
          type="button"
          variant="link"
        >
          {canResend
            ? "Resend email verification token"
            : `Resend in ${seconds}s`}
        </LoaderButton>

        <div className="pt-2">
          <LoaderButton
            className="w-full"
            isLoading={isPending}
            size="lg"
            type="submit"
          >
            Verify and continue
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
}
