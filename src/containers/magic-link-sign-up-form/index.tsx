"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Terminal } from "lucide-react"
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
import { Captcha } from "@/components/captcha"
import { LoaderButton } from "@/components/loader-button"

import { magicLinkSignUpAction } from "./actions"
import { magicLinkSignUpFormSchema } from "./validation"

interface MagicLinkSignUpFormProps {
  token: string
}

export function MagicLinkSignUpForm(props: MagicLinkSignUpFormProps) {
  const { token } = props

  const form = useForm<z.infer<typeof magicLinkSignUpFormSchema>>({
    resolver: zodResolver(magicLinkSignUpFormSchema),
    defaultValues: {
      displayName: "",
      token,
    },
  })

  const { execute, result, isPending, hasErrored } = useAction(
    magicLinkSignUpAction,
    {
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
    }
  )

  function onSubmit(values: z.infer<typeof magicLinkSignUpFormSchema>) {
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
    </Form>
  )
}
