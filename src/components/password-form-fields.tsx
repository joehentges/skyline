"use client"

import { useEffect, useState } from "react"
import { CheckIcon, XIcon } from "lucide-react"
import { Path, UseFormReturn } from "react-hook-form"
import { z } from "zod"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const commonlyUsedPasswords = [
  "Password!",
  "Qwerty123!",
  "P@ssword1",
  "Abcdefg1!",
  "1qazXsw2!",
]

function meetsPasswordComplexityRequirements(password: string) {
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

  return count >= 3
}

const passwordSchema = z.string().superRefine((password, ctx) => {
  if (!meetsPasswordComplexityRequirements(password)) {
    ctx.addIssue({
      code: "custom",
      message:
        "Password must contain at least 3 of the following: a lowercase letter, an uppercase letter, a number, or a special character.",
    })
  }
})

export const passwordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, "No less than 8 characters")
      .max(80, "No more than 80 characters"),
    confirmPassword: z
      .string()
      .min(8, "No less than 8 characters")
      .max(80, "No more than 80 characters"),
  })
  .superRefine(({ password }, ctx) => {
    if (!meetsPasswordComplexityRequirements(password)) {
      ctx.addIssue({
        code: "custom",
        message:
          "Password must contain at least 3 of the following: an uppercase letter, a lowercase letter, a number, or a special character.",
        path: ["password"],
      })
    }

    // Check if the password is on the common passwords list
    if (commonlyUsedPasswords.includes(password.toLowerCase())) {
      ctx.addIssue({
        code: "custom",
        message:
          "This password is too commonly used. Please choose a different one.",
        path: ["password"],
      })
    }
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

interface AtLeastPasswordFields {
  password: string
  confirmPassword: string
}

interface PasswordFormFieldsProps<
  T extends AtLeastPasswordFields = AtLeastPasswordFields,
> {
  form: UseFormReturn<T>
}

export function PasswordFormFields<
  T extends AtLeastPasswordFields = AtLeastPasswordFields,
>(props: PasswordFormFieldsProps<T>) {
  const { form } = props
  const [hasPasswordLength, setHasPasswordLength] = useState<boolean>(false)
  const [hasPasswordComplexity, setHasPasswordComplexity] =
    useState<boolean>(false)
  const [isNotCommonPassword, setIsNotCommonPassword] = useState<boolean>(false)

  const watchedPassword = form.watch("password" as Path<T>)

  useEffect(() => {
    const passwordLongEnough = watchedPassword.length > 7
    setHasPasswordLength(passwordLongEnough)
    setHasPasswordComplexity(passwordSchema.safeParse(watchedPassword).success)
    setIsNotCommonPassword(
      passwordLongEnough && !commonlyUsedPasswords.includes(watchedPassword)
    )
  }, [watchedPassword])

  return (
    <>
      <FormField
        control={form.control}
        name={"password" as Path<T>}
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
        name={"confirmPassword" as Path<T>}
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
    </>
  )
}
