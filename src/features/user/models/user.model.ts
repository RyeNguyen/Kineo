import { COMMON_NUMBERS } from "@/shared/constant";
import { t } from "i18next";
import { z } from "zod";

export const userSchema = z.object({
  avatar: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  id: z.number().optional(),
  lastName: z.string().optional(),
});

export const userStartupSchema = z.object({
  firstName: z
    .string()
    .nonempty(t("startup:error.first_name_required"))
    .min(
      COMMON_NUMBERS.minNameLength,
      t("startup:error.first_name_min_length", {
        min: COMMON_NUMBERS.minNameLength,
      })
    )
    .max(
      COMMON_NUMBERS.maxNameLength,
      t("startup:error.first_name_max_length", {
        min: COMMON_NUMBERS.maxNameLength,
      })
    ),
  lastName: z
    .string()
    .nonempty(t("startup:error.last_name_required"))
    .min(
      COMMON_NUMBERS.minNameLength,
      t("startup:error.last_name_min_length", {
        min: COMMON_NUMBERS.minNameLength,
      })
    )
    .max(
      COMMON_NUMBERS.maxNameLength,
      t("startup:error.last_name_max_length", {
        min: COMMON_NUMBERS.maxNameLength,
      })
    ),
});

// TypeScript type based on the schema
export type User = z.infer<typeof userSchema>;
export type UserStartup = z.infer<typeof userStartupSchema>;
