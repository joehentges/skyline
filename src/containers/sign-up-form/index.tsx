"use client"

import { useState } from "react"
import { ChevronLeftIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

import { signUpAction } from "./actions"
import { ReviewAndPasswordForm } from "./review-and-password-form"
import { UserForm } from "./user-form"
import { reviewAndPasswordFormSchema, userFormSchema } from "./validation"
import { VerifyEmailForm } from "./verify-email-form"

export function SignUpForm() {
  const [step, setStep] = useState<number>(0)
  const [formError, setFormError] = useState<string>()

  const [userData, setUserData] = useState<z.infer<typeof userFormSchema>>()

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

  function onSubmit(values: z.infer<typeof reviewAndPasswordFormSchema>) {
    if (!userData) {
      return setFormError("Please resubmit your user data")
    }

    execute({
      ...userData,
      ...values,
    })
  }

  function nextStep() {
    setStep((currentStep) => currentStep + 1)
    setFormError(undefined)
  }

  function previousStep() {
    // if going back to verify email step - skip and go back to user details step
    setStep((currentStep) => (currentStep === 2 ? 0 : currentStep - 1))
    setFormError(undefined)
  }

  function onUserFormSubmit(values: z.infer<typeof userFormSchema>) {
    setUserData(values)
    nextStep()
  }

  function onVerifyEmailFormSubmit() {
    nextStep()
  }

  return (
    <>
      {step > 0 && (
        <div className="flex items-center gap-5">
          <Button
            variant="link"
            onClick={previousStep}
            className="cursor-pointer px-0"
          >
            <ChevronLeftIcon /> Back
          </Button>
          <Progress value={step * 33} />
        </div>
      )}
      {step === 0 && (
        <UserForm
          onUserFormSubmit={onUserFormSubmit}
          defaultValues={userData}
        />
      )}
      {step === 1 && (
        <VerifyEmailForm
          onVerifyEmailFormSubmit={onVerifyEmailFormSubmit}
          email={userData?.email || ""}
        />
      )}
      {step === 2 && (
        <ReviewAndPasswordForm
          onSubmit={onSubmit}
          isPending={isPending}
          hasErrored={hasErrored || !!formError}
          errorMessage={result.serverError || formError}
        />
      )}
    </>
  )
}
