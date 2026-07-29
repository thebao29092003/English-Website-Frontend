import { useState } from "react";
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
import {
  IconArrowLeft,
  IconEye,
  IconEyeOff,
  IconCircleCheck,
} from "@tabler/icons-react";
import {
  signupStep2Schema as step2Schema,
  type SignupStep2Values as Step2Values,
} from "./schema/langdingSchema";

interface SignupFormStep2Props {
  email: string;
  otpSentMessage: string;
  isRegisterLoading: boolean;
  onBack: () => void;
  onSubmit: (data: Step2Values) => void;
}

export default function SignupFormStep2({
  email,
  otpSentMessage,
  isRegisterLoading,
  onBack,
  onSubmit,
}: SignupFormStep2Props) {
  const [showPasswords, setShowPasswords] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(step2Schema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password value to dynamically render strength indicators
  const passwordValue = watch("password") || "";

  // Password rules validation states
  const passwordRules = {
    length: passwordValue.length >= 8,
    lowercase: /[a-z]/.test(passwordValue),
    uppercase: /[A-Z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
  };

  return (
    <Form
      validationBehavior="aria"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full"
    >
      {/* Back to Step 1 Button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm transition-colors mb-2 font-mono text-gray-400 hover:text-white cursor-pointer"
      >
        <IconArrowLeft className="w-3.5 h-3.5" /> Quay lại Bước 1
      </button>

      {/* Success Notification Alert */}
      {otpSentMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-start gap-2.5 animate-pulse">
          <IconCircleCheck className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{otpSentMessage}</span>
        </div>
      )}

      {/* OTP Input */}
      <TextField
        isRequired
        validationBehavior="aria"
        isInvalid={!!errors.otp}
        className="flex flex-col w-full"
      >
        <Label className="form-label">
          Nhập Mã OTP (email: <span className="text-purple-400">{email}</span>)
        </Label>
        <Input
          id="signup-otp-input"
          maxLength={6}
          placeholder="OTP"
          className="form-input"
          {...register("otp")}
        />
        <FieldError className="form-error">{errors.otp?.message}</FieldError>
      </TextField>

      {/* Password input */}
      <TextField
        isRequired
        validationBehavior="aria"
        isInvalid={!!errors.password}
        className="flex flex-col w-full"
      >
        <Label className="form-label">Mật khẩu mới</Label>
        <div className="form-password-wrapper">
          <Input
            id="signup-password-input"
            type={showPasswords ? "text" : "password"}
            placeholder="••••••••"
            className="form-password-input"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="form-password-toggle"
          >
            {showPasswords ? <IconEyeOff size={20} /> : <IconEye size={20} />}
          </button>
        </div>
        <FieldError className="form-error">
          {errors.password?.message}
        </FieldError>
      </TextField>

      {/* Password Rules Indicators */}
      <div className="p-3 rounded-xl mt-2 grid grid-cols-2 gap-2 text-[11px] font-mono border bg-white/2 border-white/5">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[9px] ${
              passwordRules.length
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/5 border-red-500/20 text-red-400"
            }`}
          >
            {passwordRules.length ? "✓" : "✗"}
          </div>
          <span
            className={
              passwordRules.length
                ? "text-emerald-400 font-semibold"
                : "text-gray-500"
            }
          >
            Ít nhất 8 ký tự
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[9px] ${
              passwordRules.lowercase
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/5 border-red-500/20 text-red-400"
            }`}
          >
            {passwordRules.lowercase ? "✓" : "✗"}
          </div>
          <span
            className={
              passwordRules.lowercase
                ? "text-emerald-400 font-semibold"
                : "text-gray-500"
            }
          >
            1 chữ thường
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[9px] ${
              passwordRules.uppercase
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/5 border-red-500/20 text-red-400"
            }`}
          >
            {passwordRules.uppercase ? "✓" : "✗"}
          </div>
          <span
            className={
              passwordRules.uppercase
                ? "text-emerald-400 font-semibold"
                : "text-gray-500"
            }
          >
            1 chữ hoa
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[9px] ${
              passwordRules.number
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/5 border-red-500/20 text-red-400"
            }`}
          >
            {passwordRules.number ? "✓" : "✗"}
          </div>
          <span
            className={
              passwordRules.number
                ? "text-emerald-400 font-semibold"
                : "text-gray-500"
            }
          >
            1 chữ số
          </span>
        </div>
      </div>

      {/* Confirm Password input */}
      <TextField
        isRequired
        validationBehavior="aria"
        isInvalid={!!errors.confirmPassword}
        className="flex flex-col w-full"
      >
        <Label className="form-label">Nhập lại Mật khẩu</Label>
        <div className="form-password-wrapper">
          <Input
            id="signup-confirm-password-input"
            type={showPasswords ? "text" : "password"}
            placeholder="••••••••"
            className="form-password-input"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="form-password-toggle"
          >
            {showPasswords ? <IconEyeOff size={20} /> : <IconEye size={20} />}
          </button>
        </div>
        <FieldError className="form-error">
          {errors.confirmPassword?.message}
        </FieldError>
      </TextField>

      {/* Submit Button */}
      <Button
        id="signup-submit-btn"
        type="submit"
        isDisabled={isRegisterLoading}
        className="w-full h-12 button-primary"
      >
        {isRegisterLoading ? <span className="spinner" /> : null}
        Hoàn Tất Đăng Ký
      </Button>
    </Form>
  );
}
