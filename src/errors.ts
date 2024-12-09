const ErrorList: { [key: string]: string } = {
  AuthenticationError: "You must be logged in to view this content",
  RateLimitError: "Rate limit exceeded",
  LoginError: "Invalid email or password",
  NotFoundError: "Resource not found",
} as const

export class CustomError extends Error {
  constructor(message: string) {
    super(message)
  }

  static instanceOf(error: Error) {
    return ErrorList[this.name] === error.message
  }
}

export class RateLimitError extends CustomError {
  constructor() {
    const name = "RateLimitError"
    super(ErrorList[name])
    this.name = name
  }
}

export class LoginError extends CustomError {
  constructor() {
    const name = "LoginError"
    super(ErrorList[name])
    this.name = name
  }
}

export class AuthenticationError extends CustomError {
  constructor() {
    const name = "AuthenticationError"
    super(ErrorList[name])
    this.name = name
  }
}

export class NotFoundError extends CustomError {
  constructor() {
    const name = "NotFoundError"
    super(ErrorList[name])
    this.name = name
  }
}
