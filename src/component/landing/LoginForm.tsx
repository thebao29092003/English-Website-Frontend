import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useAppDispatch } from "../../API/hooks/hooks";
import { setCredentials } from "../../API/auth/authSlice";
import type { User } from "../../API/types/authApi.type";
import { jwtDecode } from "jwt-decode";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../utility/notification";
import { isRateLimitError } from "../../API/apiConfig/handleRateLimitError";
import { loginSchema, type LoginValues } from "./schema/langdingSchema";

export default function LoginForm({
  setAuthOpen,
}: {
  setAuthOpen: (open: boolean) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

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

  const navigate = useNavigate();

  const onSubmit = async (data: LoginValues) => {
    try {
      const response = await login({
        username: data.email,
        password: data.password,
      }).unwrap();
      if (response.success && response.value) {
        const decodedToken = jwtDecode<User>(response.value);
        // console.log("decodedToken", decodedToken);
        dispatch(
          setCredentials({
            user: decodedToken,
            token: response.value,
          }),
        );
        showSuccessMessage("Đăng nhập thành công");
        setAuthOpen(false);
        navigate("/home");
      }
    } catch (error: any) {
      if (!isRateLimitError(error)) {
        showErrorMessage("Đăng nhập thất bại");
      }
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
        <Label className="form-label">Địa chỉ Email</Label>
        <Input
          id="login-email-input"
          placeholder="name@company.com"
          className="form-input"
          {...register("email")}
        />
        <FieldError className="form-error">{errors.email?.message}</FieldError>
      </TextField>

      {/* Password input */}
      <TextField
        isRequired
        validationBehavior="aria"
        isInvalid={!!errors.password}
        className="flex flex-col w-full relative"
      >
        <Label className="form-label">Mật khẩu</Label>

        <div className="form-password-wrapper">
          <Input
            id="login-password-input"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="form-password-input"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="form-password-toggle"
          >
            {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
          </button>
        </div>
        <FieldError className="form-error">
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
        {isLoading ? <span className="spinner" /> : null}
        Đăng Nhập Ngay
      </Button>
    </Form>
  );
}
