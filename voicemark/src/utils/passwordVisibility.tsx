import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PasswordVisibilityProp
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordVisibility = React.forwardRef<
  HTMLInputElement,
  PasswordVisibilityProp
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="relative w-full">
      <Input
        type={showPassword ? "password" : "text"}
        className={`pr-10 ${className}`}
        {...props}
        ref={ref}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 flex items-center px-2 text-red-400 border-l-2"
      >
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
});

PasswordVisibility.displayName = "PasswordInput";

export { PasswordVisibility };