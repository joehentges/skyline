"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon, Terminal, XIcon } from "lucide-react"
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderButton } from "@/components/loader-button"

import { commonlyUsedPasswords } from "../sign-up-form/validation"
import { resetPasswordAction } from "./actions"
import { resetPasswordFormSchema } from "./validation"

const passwordSchema = z.string().superRefine((password, ctx) => {
  const containsLowercase = /[a-z]/.test(password)
  const containsUppercase = /[A-Z]/.test(password)
  const containsNumber = /\d/.test(password)
  const containsSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  const characterTypes = [
    containsLowercase,
    containsUppercase,
    containsNumber,
    containsSpecial,
  ]

  const count = characterTypes.filter(Boolean).length

  if (count < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "Password must contain at least 3 of the following: a lowercase letter, an uppercase letter, a number, or a special character.",
    })
  }
})

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm(props: ResetPasswordFormProps) {
  const [hasPasswordLength, setHasPasswordLength] = useState<boolean>(false)
  const [hasPasswordComplexity, setHasPasswordComplexity] =
    useState<boolean>(false)
  const [isNotCommonPassword, setIsNotCommonPassword] = useState<boolean>(false)

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      token: props.token,
      password: "",
      confirmPassword: "",
    },
  })

  const watchedPassword = form.watch("password")

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

  useEffect(() => {
    const passwordLongEnough = watchedPassword.length > 7
    setHasPasswordLength(passwordLongEnough)
    setHasPasswordComplexity(passwordSchema.safeParse(watchedPassword).success)
    setIsNotCommonPassword(
      passwordLongEnough && !commonlyUsedPasswords.includes(watchedPassword)
    )
  }, [watchedPassword])

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
                  placeholder="Enter your password"
                  type="password"
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="flex items-center gap-x-1">
                {hasPasswordLength ? (
                  <CheckIcon className="h-4 w-4 text-emerald-500" />
                ) : (
                  <XIcon className="text-destructive h-4 w-4" />
                )}
                At least 8 characters long
              </FormDescription>
              <FormDescription className="flex items-center gap-x-1">
                {hasPasswordComplexity ? (
                  <CheckIcon className="h-4 w-4 text-emerald-500" />
                ) : (
                  <XIcon className="text-destructive h-4 w-4" />
                )}
                Contains at least 3 of: uppercase, lowercase, numbers, special
                characters
              </FormDescription>
              <FormDescription className="flex items-center gap-x-1">
                {isNotCommonPassword ? (
                  <CheckIcon className="h-4 w-4 text-emerald-500" />
                ) : (
                  <XIcon className="text-destructive h-4 w-4" />
                )}
                Not a commonly used password
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Confirm password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  placeholder="Confirm your password"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
