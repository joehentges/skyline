"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Terminal, WandSparkles } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Captcha } from "@/components/captcha"
import { LoaderButton } from "@/components/loader-button"

import { signUpAction } from "./actions"
import { signUpFormSchema } from "./validation"

export function SignUpForm() {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const { execute, result, isPending, hasErrored } = useAction(signUpAction, {
    onError({ error }) {
      toast.error("Something went wrong", {
        description: error.serverError,
      })
    },
    onSuccess() {
      // store email in localstorage
      toast.success("Let's Go!", {
        description: "Enjoy your session",
      })
    },
  })

  function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    execute(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {hasErrored && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Uhoh, we couldn&apos;t sign you up</AlertTitle>
            <AlertDescription>{result.serverError}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  placeholder="Enter your display name"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  placeholder="Enter your email address"
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  placeholder="Enter your password"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
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
            Sign Up
          </LoaderButton>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or Sign Up with
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <Link href="/sign-in/magic">
          <Button variant="outline" className="w-full" type="submit" size="sm">
            <WandSparkles className="mr-2 h-4 w-4" /> Magic Link
          </Button>
        </Link>
      </div>
    </Form>
  )
}
