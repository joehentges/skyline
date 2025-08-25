"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Terminal } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Form } from "@/components/ui/form"
import { LoaderButton } from "@/components/loader-button"
import { PasswordFormFields } from "@/components/password-form-fields"

import { resetPasswordAction } from "./actions"
import { resetPasswordFormSchema } from "./validation"

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm(props: ResetPasswordFormProps) {
  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      token: props.token,
      password: "",
      confirmPassword: "",
    },
  })

  const { execute, result, isPending, hasErrored } = useAction(
    resetPasswordAction,
    {
      onError({ error }) {
        toast.error("Something went wrong", {
          description: error.serverError,
        })
      },
      onSuccess() {
        toast.success("Successfully reset your password!", {
          description: "You have successfully reset your password",
        })
      },
    }
  )

  function onSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
    execute(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {hasErrored && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Uhoh, we couldn&apos;t log you in</AlertTitle>
            <AlertDescription>{result.serverError}</AlertDescription>
          </Alert>
        )}

        <PasswordFormFields form={form} />

        <div className="pt-2">
          <LoaderButton
            isLoading={isPending}
            className="w-full"
            type="submit"
            size="lg"
          >
            Reset Password
          </LoaderButton>
        </div>
      </form>
    </Form>
  )
}
