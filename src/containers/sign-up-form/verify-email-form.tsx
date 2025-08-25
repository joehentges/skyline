"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { TerminalIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { LoaderButton } from "@/components/loader-button"

import { sendEmailVerificationCodeAction, verifyEmailAction } from "./actions"
import { verifyEmailFormSchema } from "./validation"

interface VerifyEmailFormProps {
  onVerifyEmailFormSubmit: () => void
  email: string
  initialOtpSecret: string
}

export function VerifyEmailForm(props: VerifyEmailFormProps) {
  const { onVerifyEmailFormSubmit, email, initialOtpSecret } = props

  const [canResend, setCanResend] = useState<boolean>(false)
  const [seconds, setSeconds] = useState<number>(60)

  const form = useForm<z.infer<typeof verifyEmailFormSchema>>({
    resolver: zodResolver(verifyEmailFormSchema),
    defaultValues: {
      otpSecret: initialOtpSecret,
      token: "",
    },
  })

  const { execute, result, isPending, hasErrored } = useAction(
    verifyEmailAction,
    {
      onError({ error }) {
        toast.error("Something went wrong", {
          description: error.serverError,
        })
      },
      onSuccess() {
        onVerifyEmailFormSubmit()
        toast.success("Email verification!", {
          description: (
            <p>
              We successfully verified your <b className="font-bold">{email}</b>{" "}
              email address.
            </p>
          ),
        })
      },
    }
  )

  const {
    execute: executeResend,
    result: rseendResult,
    isPending: resendIsPending,
    hasErrored: resendHasErrored,
  } = useAction(sendEmailVerificationCodeAction, {
    onError({ error }) {
      toast.error("Something went wrong", {
        description: error.serverError,
      })
    },
    onSuccess({ data }) {
      setCanResend(false)
      form.setValue("otpSecret", data.otpSecret)
      toast.success("Email verification code sent!", {
        description: (
          <p>
            Check your email <b className="font-bold">{email}</b> and enter the
            code.
          </p>
        ),
      })
    },
  })

  function onSubmit(values: z.infer<typeof verifyEmailFormSchema>) {
    execute(values)
  }

  function onResendClicked() {
    executeResend({ email })
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (!canResend && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1)
      }, 1000)
    } else if (seconds === 0) {
      setCanResend(true)
      setSeconds(60)
    }

    // Cleanup function to clear the interval
    return () => clearInterval(timer)
  }, [canResend, seconds])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center gap-y-5"
      >
        <p className="text-center text-lg font-medium">Email verification</p>

        {(hasErrored || resendHasErrored) && (
          <Alert variant="destructive">
            <TerminalIcon className="h-4 w-4" />
            <AlertTitle>Uhoh, we couldn&apos;t continue</AlertTitle>
            <AlertDescription>
              {result.serverError || rseendResult.serverError}
            </AlertDescription>
          </Alert>
        )}

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
          isLoading={resendIsPending}
          type="button"
          variant="link"
          className="cursor-pointer"
          disabled={!canResend}
          onClick={onResendClicked}
        >
          {canResend
            ? "Resend email verification token"
            : `Resend in ${seconds}s`}
        </LoaderButton>

        <div className="pt-2">
          <LoaderButton
            isLoading={isPending}
            className="w-full"
            type="submit"
            size="lg"
          >
            Verify and continue
          </LoaderButton>
        </div>
      </form>
    </Form>
  )
}
