import { z } from "zod";

//Schema for loggin in
const passwordValidation = new RegExp(
  /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{6,}$/
);
// const phoneValidation = new RegExp(
//   /^((\+84\s\d{3}\s\d{3}\s\d{3})|(0\d{3}\s\d{3}\s\d{3})|((\+84|0)\d{9}))$/
// );
const nameValidation = new RegExp(
  /^(?=\b[A-Za-z]*[A-Z][a-z]*\b)(?!.*[A-Z]{2})[A-Za-z ]+$/
);
// const emailValidation = new RegExp(/^[\w.-]+@(gmail\.com)$/);

export const signInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type SignIn = z.infer<typeof signInSchema>;

export const SignUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "Name is too short" })
      .regex(nameValidation, {
        message:
          "Full name must have at least 1 captalized letter, cannot have more than 2 capitalized letters in a word and must contain only letters and spaces",
      }),
    lastName: z
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
    // phoneNumber: z
    //   .string()
    //   .min(1, { message: "Please enter your phone number" })
    //   .regex(phoneValidation, {
    //     message:
    //       "Invalid phone number. Phone number must start with 0 or +84, followed by nine or ten digits",
    //   }),
    password: z
      .string()
      .min(6, { message: "Password must have at least 6 characters" })
      .regex(passwordValidation, {
        message:
          "Password must contain at least 1 capitalized letter, and 1 special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUp = z.infer<typeof SignUpSchema>;

