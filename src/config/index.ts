export const AUTH_SESSION_TTL = 1000 * 60 * 60 * 24 * 7 // 7 days

// Token Time To Live
export const TOKEN_TTL = {
  PASSWORD_RESET_EMAIL: 1000 * 60 * 60 * 1, // 1 hour
  MAGIC_LINK_EMAIL: 1000 * 60 * 60 * 1, // 1 hour
  EMAIL_VERIFICATION: 1000 * 60 * 5, // 5 minutes
}

export const REDIS_PREFIX = {
  PASSWORD_RESET: "password-reset",
  MAGIC_SIGN_IN: "magic-sign-in",
  VERIFY_EMAIL: "verify-email",
}

export const AFTER_SIGN_IN_URL = "/dashboard"
export const SIGN_IN_URL = "/sign-in"

// Error Messages
export const VALIDATION_ERROR_MESSAGE =
  "An error occurred validating your input."
export const DATABASE_ERROR_MESSAGE = "An error occurred with our database."
