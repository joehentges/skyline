"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Terminal } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Form } from "@/components/ui/form"
import { Captcha } from "@/components/captcha"
import { LoaderButton } from "@/components/loader-button"

import { PasswordFormFields } from "../password-form-fields"
import { reviewAndPasswordFormSchema } from "./validation"

interface ReviewAndPasswordFormProps {
  onSubmit: (values: z.infer<typeof reviewAndPasswordFormSchema>) => void
  isPending: boolean
  hasErrored?: boolean
  errorMessage?: string
}

export function ReviewAndPasswordForm(props: ReviewAndPasswordFormProps) {
  const { onSubmit, isPending, hasErrored, errorMessage } = props
  const form = useForm<z.infer<typeof reviewAndPasswordFormSchema>>({
    resolver: zodResolver(reviewAndPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {hasErrored && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Uhoh, we couldn&apos;t sign you up</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <PasswordFormFields form={form} />

        <Captcha
          onSuccess={(token) => form.setValue("captchaToken", token)}
          validationerror={form.formState.errors.captchaToken?.message}
        />

        <div className="pt-2">
          <LoaderButton
            isLoading={isPending}
            className="w-full"
            type="submit"
            size="lg"
          >
            Sign up
          </LoaderButton>
        </div>
      </form>
    </Form>
  )
}
