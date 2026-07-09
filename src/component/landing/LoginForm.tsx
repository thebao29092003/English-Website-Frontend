import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
} from "@heroui/react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useLoginMutation } from "../../API/auth/authApi";
import { useAppDispatch, useAppSelector } from "../../API/hooks/hooks";
import { selectCurrentUser, setCredentials } from "../../API/auth/authSlice";
import type { LoginRequest, User } from "../../API/types/authApi.type";
import { jwtDecode } from "jwt-decode";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../utility/notification";
import { loginSchema, type LoginValues } from "./schema/langdingSchema";

export default function LoginForm({
  setAuthOpen,
}: {
  setAuthOpen: (open: boolean) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

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

  const onSubmit = async (data: LoginValues) => {
    try {
      const response = await login({
        username: data.email,
        password: data.password,
      }).unwrap();
      if (response.success) {
        const decodedToken = jwtDecode(response.value);
        dispatch(
          setCredentials({
            user: decodedToken as User,
            token: response.value,
          }),
        );
        showSuccessMessage("Đăng nhập thành công");
        setAuthOpen(false);
      }
    } catch (error) {
      showErrorMessage("Đăng nhập thất bại");
    }
  };

  return (
    <Form
      validationBehavior="aria"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full"
    >
      {/* Email input */}
      <TextField
        type="email"
        isRequired
        validationBehavior="aria"
        isInvalid={!!errors.email}
        className="flex flex-col w-full"
      >
        <Label className="text-sm font-semibold font-mono text-gray-400 mb-1.5 block">
          Địa chỉ Email
        </Label>
        <Input
          id="login-email-input"
          placeholder="name@company.com"
          className="w-full border border-white/10 hover:border-purple-500/50 bg-white/5 text-white h-11 rounded-xl px-4 transition-all text-sm outline-none placeholder:text-gray-500"
          {...register("email")}
        />
        <FieldError className="text-sm text-rose-500 mt-1 block">
          {errors.email?.message}
        </FieldError>
      </TextField>

      {/* Password input */}
      <TextField
        isRequired
        validationBehavior="aria"
        isInvalid={!!errors.password}
        className="flex flex-col w-full relative"
      >
        <Label className="text-sm font-semibold font-mono text-gray-400 mb-1.5 block">
          Mật khẩu
        </Label>

        <div className="relative w-full border border-white/10 hover:border-purple-500/50 bg-white/5 text-white h-11 rounded-xl transition-all flex items-center">
          <Input
            id="login-password-input"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full bg-transparent text-white text-sm px-4 outline-none placeholder:text-gray-500 h-full border-none"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 absolute right-3 hover:text-white transition-colors cursor-pointer focus:outline-none"
          >
            {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
          </button>
        </div>
        <FieldError className="text-sm text-rose-500 mt-1 block">
          {errors.password?.message}
        </FieldError>
      </TextField>
      <Link
        to="/forgot-password"
        onClick={() => setAuthOpen(false)}
        className="flex justify-center text-sm text-blue-400 mt-[-4px] hover:underline"
      >
        Quên mật khẩu?
      </Link>

      {/* Submit button */}
      <Button
        id="login-submit-btn"
        type="submit"
        isDisabled={isLoading}
        className="w-full h-12 mt-4 button-primary"
      >
        {isLoading ? (
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : null}
        Đăng Nhập Ngay
      </Button>
    </Form>
  );
}
