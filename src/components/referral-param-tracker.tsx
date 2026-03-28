"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { REFERRAL_COOKIE_MAX_AGE_SECONDS } from "@/config";

export function ReferralParamTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");

    if (ref) {
      // biome-ignore lint/suspicious/noDocumentCookie: client-only attribution cookie; no cookie helper in deps
      document.cookie = `referral=${encodeURIComponent(ref)}; path=/; max-age=${REFERRAL_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  return null;
}
