import { DrizzleError } from "drizzle-orm"
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action"
import { ZodError } from "zod"

import { DATABASE_ERROR_MESSAGE, VALIDATION_ERROR_MESSAGE } from "@/config"
import { rateLimitByKey } from "@/lib/limiter"

import { assertAuthenticated } from "./session"

const actionClientWithMeta = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof ZodError) {
      console.error(e.message)
      return VALIDATION_ERROR_MESSAGE
    } else if (e instanceof DrizzleError) {
      console.error(e.message)
      return DATABASE_ERROR_MESSAGE
    } else if (e instanceof Error) {
      return e.message
    }

    return DEFAULT_SERVER_ERROR_MESSAGE
  },
})

export const authenticatedAction = actionClientWithMeta.use(
  async ({ next }) => {
    const user = await assertAuthenticated()
    await rateLimitByKey({
      key: `${user.id}-global`,
      limit: 10,
      window: 10000,
    })
    return next({
      ctx: {
        user,
      },
    })
  }
)

export const unauthenticatedAction = actionClientWithMeta.use(
  async ({ next }) => {
    await rateLimitByKey({
      key: `unauthenticated-global`,
      limit: 10,
      window: 10000,
    })
    return next()
  }
)
