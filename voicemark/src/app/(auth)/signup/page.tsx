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
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo/Logo";
import { UserPlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Page() {
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
      success: async () => {
        router.push("/login");
        return "Register successfully! Please login!";
      },
      error: (e) => {
        return e.response.data.error as string;
      },
    });
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Background decoration, waveform */}
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-10"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="white"
          fillOpacity="1"
          d="M0,192L48,202.7C96,213,192,235,288,218.7C384,203,480,149,576,122.7C672,96,768,96,864,122.7C960,149,1056,203,1152,197.3C1248,192,1344,128,1392,96L1440,64V320H0Z"
        ></path>
      </svg>

      {/* Left side for the branding */}
      <div className="hidden lg:flex flex-1 relative text-white flex-col justify-center items-center px-12 overflow-hidden">
        <h1 className="text-4xl font-bold mb-4 z-10">Join</h1>
        <Logo width={400} />
        <p className="text-gray-300 max-w-md text-center z-10">
          Create an account to protect and manage your audio files with
          VoiceMark.
        </p>
      </div>

      {/* Right side for the sign up form */}
      <div className="flex-1 flex items-center justify-center px-6 z-10">
        <div className="w-full max-w-md bg-black/60 rounded-lg shadow-lg border border-gray-800 p-8">
          <div className="flex flex-col items-center mb-6">
            <UserPlusIcon className="w-10 h-10 text-red-500 mb-2" />
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 text-sm mt-1">
              Fill in the details below to get started
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Enter Name</FormLabel>
                    <Input
                      {...field}
                      placeholder="Enter your username"
                      className="bg-[#2A2A2A] border-gray-700 text-white placeholder-gray-500"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email</FormLabel>
                    <Input
                      {...field}
                      placeholder="Enter your email address"
                      className="bg-[#2A2A2A] border-gray-700 text-white placeholder-gray-500"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Password</FormLabel>
                    <PasswordVisibility
                      {...field}
                      placeholder="Enter your password"
                      className="bg-[#2A2A2A] border-gray-700 text-white placeholder-gray-500"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm password */}
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      Confirm Password
                    </FormLabel>
                    <PasswordVisibility
                      {...field}
                      placeholder="Confirm your password"
                      className="bg-[#2A2A2A] border-gray-700 text-white placeholder-gray-500"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-red-400 hover:bg-red-500"
              >
                Sign Up
              </Button>
            </form>
          </Form>

          <div className="flex items-center my-6">
            <Separator className="flex-1 bg-gray-700" />
            <span className="text-gray-500 px-2 text-xs">OR</span>
            <Separator className="flex-1 bg-gray-700" />
          </div>

          <p className="text-center text-sm text-gray-400">
            Already have an account?
            <Link
              href="/login"
              className="text-red-400 hover:text-red-500 ml-1"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}