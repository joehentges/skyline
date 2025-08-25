"use client"

import Link from "next/link"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderButton } from "@/components/loader-button"

import { sendEmailVerificationCodeAction } from "./actions"
import { userFormSchema } from "./validation"

interface UserFormProps {
  onUserFormSubmit: (values: z.infer<typeof userFormSchema>) => void
  defaultValues?: z.infer<typeof userFormSchema>
}

export function UserForm(props: UserFormProps) {
  const { onUserFormSubmit, defaultValues } = props

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: defaultValues?.firstName || "",
      lastName: defaultValues?.lastName || "",
      email: defaultValues?.email || "",
    },
  })

  const { execute, result, isPending, hasErrored } = useAction(
    sendEmailVerificationCodeAction,
    {
      onError({ error }) {
        toast.error("Something went wrong", {
          description: error.serverError,
        })
      },
      onSuccess({ data }) {
        onUserFormSubmit(form.getValues())
        toast.success("Email verification code sent!", {
          description: (
            <p>
              Check your email <b className="font-bold">{data.email}</b> and
              enter the code.
            </p>
          ),
        })
      },
    }
  )

  function onSubmit(values: z.infer<typeof userFormSchema>) {
    execute(values)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {hasErrored && (
            <Alert variant="destructive">
              <TerminalIcon className="h-4 w-4" />
              <AlertTitle>Uhoh, we couldn&apos;t continue</AlertTitle>
              <AlertDescription>{result.serverError}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required>First name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Smith" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="jsmith@company.com"
                    type="email"
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
              Continue
            </LoaderButton>
          </div>
        </form>
      </Form>
      <div>
        <p className="text-center">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </>
  )
}
