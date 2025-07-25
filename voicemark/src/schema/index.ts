import { z } from "zod";

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/
);

const nameValidation = new RegExp(
  /^(?=\b[A-Za-z]*[A-Z][a-z]*\b)(?!.*[A-Z]{2})[A-Za-z ]+$/
);

export const signInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type SignIn = z.infer<typeof signInSchema>;

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name is too short" })
      .regex(nameValidation, {
        message:
          "Full name must have at least 1 captalized letter, cannot have more than 2 capitalized letters in a word and must contain only letters and spaces",
      }),
    email: z
      .string()
      .email({
        message: "Email must follow the format with a domain of @gmail.com.",
      })
      .min(10, { message: "Invalid email format" }),
    password: z
      .string()
      .min(6, { message: "Password must have at least 6 characters" })
      .regex(passwordValidation, {
        message:
          "Password must contain at least 1 capitalized letter and number",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUp = z.infer<typeof SignUpSchema>;

