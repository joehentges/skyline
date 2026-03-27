"use client";

import { CheckIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Path, UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { commonlyUsedPasswords, passwordSchema } from "./validation";

interface AtLeastPasswordFields {
  confirmPassword: string;
  password: string;
}

interface PasswordFormFieldsProps<
  T extends AtLeastPasswordFields = AtLeastPasswordFields,
> {
  form: UseFormReturn<T>;
}

export function PasswordFormFields<
  T extends AtLeastPasswordFields = AtLeastPasswordFields,
>(props: PasswordFormFieldsProps<T>) {
  const { form } = props;
  const [hasPasswordLength, setHasPasswordLength] = useState<boolean>(false);
  const [hasPasswordComplexity, setHasPasswordComplexity] =
    useState<boolean>(false);
  const [isNotCommonPassword, setIsNotCommonPassword] =
    useState<boolean>(false);

  const watchedPassword = form.watch("password" as Path<T>);

  useEffect(() => {
    const passwordLongEnough = watchedPassword.length > 7;
    setHasPasswordLength(passwordLongEnough);
    setHasPasswordComplexity(passwordSchema.safeParse(watchedPassword).success);
    setIsNotCommonPassword(
      passwordLongEnough && !commonlyUsedPasswords.includes(watchedPassword)
    );
  }, [watchedPassword]);

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
                placeholder="••••••••••"
                type="password"
              />
            </FormControl>
            <FormMessage />
            <FormDescription className="flex items-center gap-x-1">
              {hasPasswordLength ? (
                <CheckIcon className="h-4 w-4 text-emerald-500" />
              ) : (
                <XIcon className="h-4 w-4 text-destructive" />
              )}
              At least 8 characters long
            </FormDescription>
            <FormDescription className="flex items-center gap-x-1">
              {hasPasswordComplexity ? (
                <CheckIcon className="h-4 w-4 text-emerald-500" />
              ) : (
                <XIcon className="h-4 w-4 text-destructive" />
              )}
              Contains at least 3 of: uppercase, lowercase, numbers, special
              characters
            </FormDescription>
            <FormDescription className="flex items-center gap-x-1">
              {isNotCommonPassword ? (
                <CheckIcon className="h-4 w-4 text-emerald-500" />
              ) : (
                <XIcon className="h-4 w-4 text-destructive" />
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
                placeholder="••••••••••"
                type="password"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
