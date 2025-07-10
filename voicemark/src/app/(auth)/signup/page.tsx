"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordVisibility } from "@/utils/passwordVisibility";
import { SignUp, SignUpSchema } from "@/schema";
import { userSignup } from "@/api/auth";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "next/navigation";

export default function Page() {
  const { login } = useUserStore();
  const router = useRouter();
  const defaultState: SignUp = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const form = useForm<SignUp>({
    defaultValues: defaultState,
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: SignUp) => {
    const onRegister = userSignup({
      ...values,
    });
    toast.promise(onRegister, {
      loading: "Creating your account...",
      success: async (res) => {
        // await auth(res.data.dto);
        // login(res.data.dto);
        router.push("/login");
        return "Register successfully! Please login!";
      },
      error: (e) => {
        return e.response.data.error as string;
      },
    });
  };

  return (
    <div className="flex screen">
      <div className="flex-[9] flex flex-col justify-center items-center w-full lg:w-auto">
        <h1 className="font-bold text-4xl text-blue whitespace-nowrap py-10">
          Account Creation
        </h1>

        <div className="w-4/5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex gap-4 mb-3">
                {/* Name Field */}
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1 basis-1/3">
                      <FormLabel>Full Name</FormLabel>
                      <Input {...field} placeholder="Your full name:" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email Address Field */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Email Address</FormLabel>
                    <Input {...field} placeholder="Enter your email address:" />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Password</FormLabel>
                    <PasswordVisibility
                      {...field}
                      placeholder="Enter your password:"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <PasswordVisibility
                      {...field}
                      placeholder="Confirm your password:"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full mt-4 bg-blue-800 rounded-lg hover:bg-blue-900"
                variant={"default"}
              >
                Sign Up
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
