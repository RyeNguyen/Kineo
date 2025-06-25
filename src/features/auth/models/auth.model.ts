import { COMMON_NUMBERS } from "@/shared/constant";
import { t } from "i18next";
import { z } from "zod";

export const authSchema = z.object({
  accessToken: z.string().optional(), // JWT validation can be added if necessary
  email: z.string().email().optional(), // Ensures it's a valid email
  firstName: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(), // Adjust if needed
  id: z.number().optional(),
  image: z.string().url().optional(), // Ensures it's a valid URL
  lastName: z.string().optional(),
  refreshToken: z.string().optional(),
  username: z.string().optional(),
});

export const loginFormSchema = z.object({
  email: z
    .string()
    .nonempty(t("auth:error.email_required"))
    .email(t("auth:error.email_invalid")),
  password: z
    .string()
    .nonempty(t("auth:error.password_required"))
    .min(
      COMMON_NUMBERS.minPasswordLength,
      t("auth:error.password_min_length", {
        min: COMMON_NUMBERS.minPasswordLength,
      })
    ),
});

export const registerFormSchema = z
  .object({
    email: z
      .string()
      .nonempty(t("auth:error.email_required"))
      .email(t("auth:error.email_invalid")),
    password: z
      .string()
      .nonempty(t("auth:error.password_required"))
      .min(
        COMMON_NUMBERS.minPasswordLength,
        t("auth:error.password_min_length", {
          min: COMMON_NUMBERS.minPasswordLength,
        })
      ),
    passwordConfirm: z
      .string()
      .nonempty(t("auth:error.confirm_password_required")),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: t("auth:error.password_mismatch"),
    path: ["passwordConfirm"], // This points to the field causing the error
  });

// TypeScript type based on the schema
export type Auth = z.infer<typeof authSchema>;
export type LoginForm = z.infer<typeof loginFormSchema>;
export type RegisterForm = z.infer<typeof registerFormSchema>;
