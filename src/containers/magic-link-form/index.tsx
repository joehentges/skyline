"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Terminal } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

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
import { useToast } from "@/hooks/use-toast"

import { sendMagicLinkAction } from "./actions"

const magicLinkFormSchema = z.object({
  email: z.string().email(),
  from: z.string().min(2).optional(),
})

interface MagicLinkFormProps {
  from?: string
}

export function MagicLinkForm(props: MagicLinkFormProps) {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof magicLinkFormSchema>>({
    resolver: zodResolver(magicLinkFormSchema),
    defaultValues: {
      email: "",
      from: props.from,
    },
  })

  const { execute, isPending, error } = useServerAction(sendMagicLinkAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess() {
      const email = form.getValues("email")
      form.reset()
      // store email in localstorage
      toast({
        title: "Email sent!",
        description: `Your magic link has been sent to ${email}`,
      })
    },
  })

  function onSubmit(values: z.infer<typeof magicLinkFormSchema>) {
    execute(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Uhoh, we couldn&apos;t send your magic link</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

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

        <div className="pt-2">
          <LoaderButton
            isLoading={isPending}
            className="w-full"
            type="submit"
            size="lg"
          >
            Send
          </LoaderButton>
        </div>
      </form>
    </Form>
  )
}
