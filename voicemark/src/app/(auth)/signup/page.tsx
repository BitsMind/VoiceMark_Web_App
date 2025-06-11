import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart2Icon } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordVisibility } from "@/utils/passwordVisibility";
import { Separator } from "@/components/ui/separator";
import { SignUp, SignUpSchema } from "@/schema";
import { userRegister } from "@/actions/register";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { auth, loginWithFb, loginWithGoogle } from "@/actions/auth";
import GeoSearchForm from "@/components/map/geoSearchForm";

export default function DefaultRegisterForm() {
  const { login } = useUserStore();
  const router = useRouter();
  const defaultState: SignUp = {
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    homeAddress: "",
    password: "",
    confirmPassword: "",
    googleId: null,
    facebookId: null,
    location: {
      latitude: 0,
      longitude: 0,
    },
  };

  const form = useForm<SignUp>({
    defaultValues: defaultState,
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
  });

  const loginGoogle = async () => {
    const res = await loginWithGoogle();
    if (res.error) {
      toast.error("Something went wrong");
    } else {
      router.push(res.redirectUrl);
    }
  };

  const loginFb = async () => {
    const res = await loginWithFb();
    if (res.error) {
      toast.error("Something went wrong");
    } else {
      router.push(res.redirectUrl);
    }
  };

  const onSubmit = async (values: SignUp) => {
    const onRegister = userRegister({
      ...values,
      userRole: "ROLE_FARMER",
      googleId: null,
      facebookId: null,
    });
    toast.promise(onRegister, {
      loading: "Creating your account...",
      success: async (res) => {
        await auth(res.data.dto);
        login(res.data.dto);
        router.push("/farmer/orders");
        return "Register successfully!";
      },
      error: (e) => {
        switch (e.response.status) {
          case 401:
            return e.response.data.message as string;
          case 404:
            return e.response.data.message as string;
          case 409:
            return e.response.data.message as string;
          default:
            return "Internal Server Error";
        }
      },
    });
  };

  // Handle address selection from GeoSearchForm
  const handleAddressSelect = (
    address: string,
    longitude: number,
    latitude: number,
  ) => {
    form.setValue("homeAddress", address); // Update the home address field in the form
    form.setValue("location.latitude", latitude); // Update the home address field in the form
    form.setValue("location.longitude", longitude); // Update the home address field in the form
  };

  return (
    <div className="flex screen">
      {/* Left side of the screen hidden on small & medium screens */}
      <div className="hidden lg:flex flex-[11] flex-col justify-center items-center bg-blue-600">
        <div className="info-box">
          <div className="info-content">
            <h1 className="text-blue">Already have an account? Sign in!</h1>
            <p className="text-blue pt-3">
              Enter your personal details and start a wonderful journey with us!
            </p>
          </div>

          <div className="absolute bottom-0 right-10 w-3/12">
            <Link href={`/auth/login/`}>
              <Button
                className="w-full bg-blue-800 my-5 rounded-full hover:bg-blue-900"
                variant={"default"}
              >
                Sign in
              </Button>
            </Link>
          </div>

          {/* Rating box */}
          <div className="rating-box shadow-all">
            <BarChart2Icon
              className="self-center"
              style={{ color: "blue" }}
              strokeWidth={3}
            />
            <div className="pl-5 text-blue-800">
              <span className="block text-sm"> Our rating among farms! </span>
              <span className="block text-xl font-bold"> 0.85 </span>
            </div>
          </div>
        </div>

        <div className="text-white text-center w-3/5">
          <h1 className="pt-20 pb-10 text-3xl font-bold">Come Join Us!</h1>
          <p className="text-balance">
            By signing up, you will gain access to among the most reliable, and
            experienced sprayer team, among many perks and rewards...
          </p>
        </div>
      </div>

      {/* Right side of the screen, full width on small & medium screens */}
      <div className="flex-[9] flex flex-col justify-center items-center w-full lg:w-auto">
        <h1 className="font-bold text-4xl text-blue whitespace-nowrap py-10">
          Account Creation
        </h1>

        <div className="w-4/5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex gap-4 mb-3">
                <FormField
                  name="fullName"
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

              {/* Phone Number Field */}
              <FormField
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Phone Number</FormLabel>
                    <Input {...field} placeholder="Enter your phone number:" />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Address Field */}
              <FormField
                name="emailAddress"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Email Address</FormLabel>
                    <Input {...field} placeholder="Enter your email address:" />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Home Address Field with GeoSearch */}
              <FormField
                name="homeAddress"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Home Address</FormLabel>
                    <GeoSearchForm onSelect={handleAddressSelect} />
                    <Input
                      {...field}
                      placeholder="Enter your address"
                      disabled
                    />
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

        {/* Separation Line */}
        <div className="w-2/5 justify-center my-5 flex items-center">
          <Separator className="ml-12" />
          <span className="text-sm"> OR </span>
          <Separator className="mr-12" />
        </div>

        {/* Social login*/}
        <div className="flex flex-col justify-center items-center ">
          <Link href={``}>
            <Button
              className="mx-2 rounded-full mb-2 w-96"
              variant={"outline"}
              onClick={() => loginGoogle()}
            >
              Continue with Google
            </Button>
          </Link>

          <Link href={``}>
            <Button
              className="mx-2 rounded-full w-96 mb-2"
              variant={"outline"}
              onClick={() => loginFb()}
            >
              Continue with Facebook
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}