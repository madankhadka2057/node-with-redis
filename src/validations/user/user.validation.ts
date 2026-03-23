import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
      message: "Only Gmail addresses are allowed",
    }),

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long")
    .optional()
    .nullable(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number")
    .regex(/[@$!%*?&]/, "Must include at least one special character"),

  phone: z
    .string()
    .trim()
    .refine((val) => !val.startsWith("+977") && !val.startsWith("977"), {
      message: "Do not include country code (+977 or 977)",
    })
    .regex(/^\d{10}$/, {
      message: "Phone number must be exactly 10 digits",
    }),

  addresse: z
    .string()
    .trim()
    .max(255, "Address too long")
    .optional()
    .nullable(),
});

export type CreateUserType = z.infer<typeof createUserSchema>;

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginUserType = z.infer<typeof loginUserSchema>;