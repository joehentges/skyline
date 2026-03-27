import z from "zod";

const LOWERCASE_REGEX = /[a-z]/;
const UPPERCASE_REGEX = /[A-Z]/;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export const commonlyUsedPasswords = [
  "Password!",
  "Qwerty123!",
  "P@ssword1",
  "Abcdefg1!",
  "1qazXsw2!",
];

function meetsPasswordComplexityRequirements(password: string) {
  const containsLowercase = LOWERCASE_REGEX.test(password);
  const containsUppercase = UPPERCASE_REGEX.test(password);
  const containsNumber = DIGIT_REGEX.test(password);
  const containsSpecial = SPECIAL_CHAR_REGEX.test(password);

  const characterTypes = [
    containsLowercase,
    containsUppercase,
    containsNumber,
    containsSpecial,
  ];

  const count = characterTypes.filter(Boolean).length;

  return count >= 3;
}

export const passwordSchema = z.string().superRefine((password, ctx) => {
  if (!meetsPasswordComplexityRequirements(password)) {
    ctx.addIssue({
      code: "custom",
      message:
        "Password must contain at least 3 of the following: a lowercase letter, an uppercase letter, a number, or a special character.",
    });
  }
});

export const passwordFormSchema = z.object({
  password: z
    .string()
    .min(8, "No less than 8 characters")
    .max(80, "No more than 80 characters"),
  confirmPassword: z
    .string()
    .min(8, "No less than 8 characters")
    .max(80, "No more than 80 characters"),
});

export const passwordFormSchemaSuperRefine = (
  { password, confirmPassword }: { password: string; confirmPassword: string },
  ctx: z.core.$RefinementCtx<{
    password: string;
    confirmPassword: string;
  }>
) => {
  if (!meetsPasswordComplexityRequirements(password)) {
    ctx.addIssue({
      code: "custom",
      message:
        "Password must contain at least 3 of the following: an uppercase letter, a lowercase letter, a number, or a special character.",
      path: ["password"],
    });
  }

  // Check if the password is on the common passwords list
  if (commonlyUsedPasswords.includes(password.toLowerCase())) {
    ctx.addIssue({
      code: "custom",
      message:
        "This password is too commonly used. Please choose a different one.",
      path: ["password"],
    });
  }

  if (password !== confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });
  }
};
