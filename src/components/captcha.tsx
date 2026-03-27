"use client";

import dynamic from "next/dynamic";
import { FormMessage } from "@/components/ui/form";
import { env } from "@/env";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  {
    ssr: false,
  }
);

interface CaptchaProps {
  onSuccess: (token: string) => void;
  validationerror?: string;
}

export const Captcha = (props: CaptchaProps) => {
  const isTurnstileEnabled = Boolean(
    env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
  );

  return isTurnstileEnabled ? (
    <>
      <Turnstile
        onSuccess={props.onSuccess}
        options={{
          size: "flexible",
          language: "auto",
        }}
        siteKey={env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || ""}
      />

      {props?.validationerror && (
        <FormMessage className="mt-2 text-red-500">
          {props.validationerror}
        </FormMessage>
      )}
    </>
  ) : null;
};
