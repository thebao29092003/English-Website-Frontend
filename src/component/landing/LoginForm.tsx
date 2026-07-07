import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
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

interface LoginFormProps {
  onSuccess: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Địa chỉ email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

// nó dịch ngược từ schema của yup thành type trong typescript, khi thay đổi schema thì type
// nó thay đổi theo
type LoginValues = yup.InferType<typeof loginSchema>;

export default function LoginForm({
  onSuccess,
  loading,
  setLoading,
}: LoginFormProps) {
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

  const onSubmit = (_data: LoginValues) => {
    setLoading(true);

    // Simulate login API call
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
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
      <a
        href="#"
        className="flex justify-center text-sm text-blue-400 mt-[-4px] hover:underline"
      >
        Quên mật khẩu?
      </a>

      {/* Submit button */}
      <Button
        id="login-submit-btn"
        type="submit"
        isDisabled={loading}
        className="w-full h-12 mt-4 rounded-xl bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-98 transition-all cursor-pointer"
      >
        {loading ? (
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : null}
        Đăng Nhập Ngay
      </Button>
    </Form>
  );
}
