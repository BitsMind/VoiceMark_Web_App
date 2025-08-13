"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { PasswordVisibility } from "@/utils/passwordVisibility";
import { SignIn, signInSchema } from "@/schema";
import { useRouter } from "next/navigation";
import { login } from "@/api/auth";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user-store";
import { LogInIcon } from "lucide-react";
import { Logo } from "@/components/logo/Logo";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useUserStore();

  const form = useForm<SignIn>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: SignIn) => {
    const userLogin = login({
      email: values.email,
      password: values.password,
    });

    toast.promise(userLogin, {
      loading: "Authenticating user...",
      success: async (data) => {
        setCurrentUser(data);
        if (data.userType === "USER" || data.userType === "PRO") {
          router.push("/home");
        } else if (data.userType === "ADMIN") {
          router.push("/admin");
        }
        return `Login successfully!`;
      },
      error: (e) => e.response.data.error || "Login failed",
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* a background decoration, shape of a waveform */}
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
      {/* Left side, for branding and stuffs */}
      <div className="hidden lg:flex flex-1 relative text-white flex-col justify-center items-center px-12 overflow-hidden">
        <h1 className="text-4xl font-bold mb-4 z-10">Welcome to</h1>
         <Logo width={400}/>
        <p className="text-gray-300 max-w-md text-center z-10">
          Secure, detect, and own your audio files. Sign in to continue.
        </p>
      </div>

      {/* Right side for the login form*/}
      <div className="flex-1 flex items-center justify-center px-6 z-100">
        <div className="w-full max-w-md bg-black/60 rounded-lg shadow-lg border border-gray-800 p-8">
          <div className="flex flex-col items-center mb-6">
            <LogInIcon className="w-10 h-10 text-red-500 mb-2" />
            <h1 className="text-2xl font-bold text-white">Sign In</h1>
            <p className="text-gray-400 text-sm mt-1">
              Securely access your account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">E-mail</FormLabel>
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      className="bg-[#2A2A2A] border-gray-700 text-white placeholder-gray-500"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
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

              <Button
                type="submit"
                className="w-full bg-red-400 hover:bg-red-500"
              >
                Sign In
              </Button>
            </form>
          </Form>

          <div className="flex items-center my-6">
            <Separator className="flex-1 bg-gray-700" />
            <span className="text-gray-500 px-2 text-xs">OR</span>
            <Separator className="flex-1 bg-gray-700" />
          </div>

          <p className="text-center text-sm text-gray-400">
            Don’t have an account?
            <Link
              href="/signup"
              className="text-red-400 hover:text-red-500 ml-1"
            >
              Create now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
