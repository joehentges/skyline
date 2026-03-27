import { env } from "@/env";

interface TurnstileResponse {
  "error-codes"?: string[];
  success: boolean;
}

export async function validateTurnstileToken(token: string) {
  if (!env.CLOUDFLARE_TURNSTILE_SECRET_KEY) {
    return true;
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  );

  const data = (await response.json()) as TurnstileResponse;

  return data.success;
}
