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
import { PasswordVisibility } from "@/utils/passwordVisibility";
import { BarChart2Icon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SignIn, signInSchema } from "@/schema";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user-store";

export default function Page() {
  const router = useRouter();
  const { setCurrentUser } = useUserStore();
  const defaultState: SignIn = {
    email: "",
    password: "",
  };

  const form = useForm<SignIn>({
    defaultValues: defaultState,
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
      error: (e) => {
        return e.response.data.error as string;
      },
    });
  };

  return (
    <div className="flex screen">
      <div className="flex-[9] flex flex-col justify-center items-center w-full lg:w-auto">
        <h1 className="font-bold text-4xl text-blue-800 whitespace-nowrap py-10">
          Sign In
        </h1>

        <div className="w-4/5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>E-mail</FormLabel>
                    <Input {...field} placeholder="Enter your email:" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <PasswordVisibility
                      {...field}
                      placeholder="Enter your password:"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded-sm"
                  />
                  <Label htmlFor="remember-me">Remember me</Label>
                </div>

                {/* Forgot Password Link */}
                <div className="text-blue-500 underline text-sm hover:text-blue-800">
                  <Link href={""}>Forgot Password?</Link>
                </div>
              </div>

              <Button
                className="w-full mt-10 bg-blue-800 rounded-md hover:bg-blue-900"
                variant={"default"}
              >
                Sign In
              </Button>
            </form>
          </Form>
        </div>

        {/* Separation Line */}
        <div className="w-2/5 justify-center my-5 flex items-center">
          <Separator className="ml-12" />
          <span className="text-sm"> OR </span>
          <Separator className="mr-12" />
        </div>

        {/* Social login*/}
        <div className="flex flex-col justify-center items-center">
          <div className="pt-5">
            <span className="font-light text-sm"> Don't have an account?</span>
            <Link href={`/auth/signup/`}>
              <span className="text-blue-500 underline text-sm pl-1 hover:text-blue-800">
                Create now
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
