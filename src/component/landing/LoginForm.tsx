import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconMail, IconLock, IconArrowRight, IconEye, IconEyeOff } from "@tabler/icons-react";

interface LoginFormProps {
  onSuccess: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isDark: boolean;
}

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Địa chỉ email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu"),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

// Custom fully styled Input to resolve React DOM unrecognized prop warnings
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isInvalid?: boolean;
  errorMessage?: string;
  labelPlacement?: "inside" | "outside";
  classNames?: {
    label?: string;
    inputWrapper?: string;
    input?: string;
  };
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      startContent,
      endContent,
      isInvalid,
      errorMessage,
      labelPlacement,
      classNames,
      className,
      id,
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col w-full">
        {label && (
          <label
            htmlFor={id}
            className={classNames?.label || "text-xs font-semibold font-mono text-gray-400 mb-1.5 block"}
          >
            {label}
          </label>
        )}
        <div
          className={`${
            classNames?.inputWrapper ||
            "border border-white/10 hover:border-purple-500/50 focus-within:!border-purple-500 bg-white/5 text-white h-11 rounded-xl transition-all"
          } flex items-center gap-2 px-3 relative ${
            isInvalid ? "!border-red-500/50 focus-within:!border-red-500" : ""
          }`}
        >
          {startContent && <div className="flex items-center justify-center shrink-0">{startContent}</div>}
          <input
            id={id}
            type={type}
            ref={ref}
            className={`${
              classNames?.input || "text-white placeholder:text-gray-500 text-sm"
            } flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 h-full w-full`}
            {...props}
          />
          {endContent && <div className="flex items-center justify-center shrink-0">{endContent}</div>}
        </div>
        {isInvalid && errorMessage && (
          <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-mono">
            <span>{errorMessage}</span>
          </p>
        )}
      </div>
    );
  }
);
CustomInput.displayName = "CustomInput";

// Custom fully styled Button to resolve React DOM unrecognized prop warnings
interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ isLoading, startContent, endContent, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={className}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4 text-current shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!isLoading && startContent && <span className="flex items-center shrink-0">{startContent}</span>}
        <span>{children}</span>
        {!isLoading && endContent && <span className="flex items-center shrink-0">{endContent}</span>}
      </button>
    );
  }
);
CustomButton.displayName = "CustomButton";

export default function LoginForm({ onSuccess, loading, setLoading, isDark }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setLoading(true);
    // Simulate login API call
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email input */}
      <CustomInput
        id="login-email-input"
        type="email"
        label="Địa chỉ Email"
        placeholder="name@company.com"
        labelPlacement="outside"
        // startContent={<IconMail className="text-gray-500 w-4.5 h-4.5 shrink-0" />}
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        {...register("email")}
        classNames={{
          label: "text-xs font-semibold font-mono text-gray-400 mb-1.5 block",
          inputWrapper: "border border-white/10 hover:border-purple-500/50 focus-within:!border-purple-500 bg-white/5 text-white h-11 rounded-xl transition-all",
          input: "text-white placeholder:text-gray-500 text-sm",
        }}
      />

      {/* Password input */}
      <div className="relative">
        <div className="absolute right-0 top-0 z-10">
          <a href="#" className="text-xs text-blue-400 hover:underline">Quên mật khẩu?</a>
        </div>
        <CustomInput
          id="login-password-input"
          type={showPassword ? "text" : "password"}
          label="Mật khẩu"
          placeholder="••••••••"
          labelPlacement="outside"
          // startContent={<IconLock className="text-gray-500 w-4.5 h-4.5 shrink-0" />}
          endContent={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              {/* {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />} */}
            </button>
          }
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          {...register("password")}
          classNames={{
            label: "text-xs font-semibold font-mono text-gray-400 mb-1.5 block",
            inputWrapper: "border border-white/10 hover:border-purple-500/50 focus-within:!border-purple-500 bg-white/5 text-white h-11 rounded-xl transition-all",
            input: "text-white placeholder:text-gray-500 text-sm",
          }}
        />
      </div>

      {/* Submit button */}
      <CustomButton
        id="login-submit-btn"
        type="submit"
        isLoading={loading}
        className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-98 transition-all cursor-pointer"
        // endContent={!loading && <IconArrowRight className="w-4.5 h-4.5" />}
      >
        Đăng Nhập Ngay
      </CustomButton>
    </form>
  );
}
