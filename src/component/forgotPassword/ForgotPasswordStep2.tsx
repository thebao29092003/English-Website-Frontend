import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  forgotPasswordStep2Schema as step2Schema,
  type ForgotPasswordStep2Values as Step2Values,
} from "../landing/schema/langdingSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation } from "react-router-dom";
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
  IconRefresh,
  IconEye,
  IconEyeOff,
  IconCircleCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import {
  useLazyForgotPasswordSendOtpQuery,
  useResetPasswordMutation,
} from "../../API/auth/authApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../utility/notification";
import ScrollToTop from "../../utility/ScrollToTop";

export default function ForgotPasswordStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [countdown, setCountdown] = useState(30);
  const [otpSentMessage, setOtpSentMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const [sendOtp, { isFetching: isOtpLoading }] =
    useLazyForgotPasswordSendOtpQuery();
  const [resetPassword, { isLoading: isResetLoading }] =
    useResetPasswordMutation();

  // Redirect to Step 1 if email is missing
  useEffect(() => {
    if (!email) {
      showErrorMessage(
        "Không tìm thấy thông tin email. Vui lòng thực hiện lại từ đầu.",
      );
    }
  }, [email]);

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

  const passwordRules = {
    length: passwordValue.length >= 8,
    lowercase: /[a-z]/.test(passwordValue),
    uppercase: /[A-Z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
  };

  // Countdown timer logic for Resend OTP (30s)
  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prev) => prev - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const onSubmit = async (data: Step2Values) => {
    if (!email) {
      showErrorMessage("Không có địa chỉ email. Vui lòng quay lại bước 1.");
      return;
    }

    try {
      const response = await resetPassword({
        email: email,
        otp: data.otp,
        newPassword: data.password,
        repeatNewPassword: data.confirmPassword,
      }).unwrap();

      if (response.success) {
        showSuccessMessage("Đặt lại mật khẩu thành công!");
        navigate("/");
      }
    } catch (err: any) {
      showErrorMessage("Đặt lại mật khẩu thất bại");
      navigate("/");
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isOtpLoading || !email) return;
    try {
      const response = await sendOtp(email).unwrap();
      if (response.success) {
        setCountdown(30);
        setOtpSentMessage("Một mã OTP mới đã được gửi tới email của bạn.");
        setTimeout(() => setOtpSentMessage(""), 5000);
      }
    } catch (err: any) {
      showErrorMessage("Lỗi khi gửi mã OTP");
    }
  };

  if (!email) {
    return (
      <div className="w-full min-h-screen overflow-x-hidden bg-[#030014] text-white flex flex-col items-center justify-center relative px-4">
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-md p-8 shadow-2xl bg-[#030014]/85 border border-white/10 text-center max-w-sm w-full">
          <IconAlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Lỗi xác thực</h2>
          <p className="text-sm text-gray-400 mb-6">
            Không tìm thấy thông tin email. Vui lòng bắt đầu lại quy trình đặt
            lại mật khẩu.
          </p>
          <Button
            onClick={() => navigate("/forgot-password")}
            className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm cursor-pointer"
          >
            Quay lại Bước 1
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="forgot-password-step2-root"
      className="forgot-password-root dark animate-fade-in"
    >
      <ScrollToTop />

      {/* Decorative background glows */}
      <div className="glow-orb top-20 left-1/4 w-96 h-96 bg-purple-500/10 blur-[120px]" />
      <div className="glow-orb bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px]" />

      <div className="max-w-md w-full relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/forgot-password")}
          className="mb-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer group w-fit hover:translate-x-[-2px] transition-transform duration-200 font-mono"
        >
          <IconArrowLeft className="w-4 h-4" /> Quay lại Bước 1
        </button>

        {/* Card container */}
        <div className="forgot-password-card">
          {/* Top glowing bar */}
          <div className="forgot-password-glow-bar" />

          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="forgot-password-title">
              Đặt Lại Mật Khẩu
            </h2>
            <p className="forgot-password-subtitle">
              Nhập mã OTP được gửi tới{" "}
              <span className="text-purple-400 font-semibold">{email}</span>
            </p>
          </div>

          {/* Success Notification Alert */}
          {otpSentMessage && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-start gap-2.5 animate-pulse">
              <IconCircleCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{otpSentMessage}</span>
            </div>
          )}

          {/* Form */}
          <Form
            validationBehavior="aria"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            {/* OTP Input */}
            <TextField
              isRequired
              validationBehavior="aria"
              isInvalid={!!errors.otp}
              className="flex flex-col w-full"
            >
              <Label className="form-label">
                Nhập Mã OTP
              </Label>
              <Input
                id="reset-otp-input"
                maxLength={6}
                placeholder="OTP"
                className="form-input"
                {...register("otp")}
              />
              <FieldError className="form-error">
                {errors.otp?.message}
              </FieldError>
            </TextField>

            {/* Password input */}
            <TextField
              isRequired
              validationBehavior="aria"
              isInvalid={!!errors.password}
              className="flex flex-col w-full"
            >
              <Label className="form-label">
                Mật khẩu mới
              </Label>
              <div className="form-password-wrapper">
                <Input
                  id="reset-password-input"
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
                  {showPasswords ? (
                    <IconEyeOff size={20} />
                  ) : (
                    <IconEye size={20} />
                  )}
                </button>
              </div>
              <FieldError className="form-error">
                {errors.password?.message}
              </FieldError>
            </TextField>

            {/* Password Rules Indicators */}
            <div className="p-3 rounded-xl grid grid-cols-2 gap-2 text-[11px] font-mono border bg-white/2 border-white/5">
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
              <Label className="form-label">
                Nhập lại Mật khẩu
              </Label>
              <div className="form-password-wrapper">
                <Input
                  id="reset-confirm-password-input"
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
                  {showPasswords ? (
                    <IconEyeOff size={20} />
                  ) : (
                    <IconEye size={20} />
                  )}
                </button>
              </div>
              <FieldError className="form-error">
                {errors.confirmPassword?.message}
              </FieldError>
            </TextField>

            {/* Actions row */}
            <div className="flex justify-between gap-2">
              {/* Resend OTP button */}
              <Button
                type="button"
                id="reset-resend-otp"
                onClick={handleResendOtp}
                isDisabled={countdown > 0 || isOtpLoading}
                className={`h-12 rounded-xl text-sm font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  countdown > 0 || isOtpLoading
                    ? "bg-white/2 border-white/5 text-gray-500 cursor-not-allowed"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white cursor-pointer"
                }`}
              >
                {isOtpLoading ? (
                  <span className="spinner h-3.5 w-3.5" />
                ) : (
                  <IconRefresh
                    className={`w-3.5 h-3.5 ${countdown > 0 ? "" : "animate-spin-slow"}`}
                  />
                )}
                {isOtpLoading
                  ? "Đang gửi..."
                  : countdown > 0
                    ? `Gửi lại (${countdown}s)`
                    : "Gửi lại OTP"}
              </Button>

              {/* Reset Password button */}
              <Button
                id="reset-submit-btn"
                type="submit"
                isDisabled={isResetLoading}
                className="h-12 button-primary"
              >
                {isResetLoading ? (
                  <span className="spinner" />
                ) : null}
                Hoàn Tất Đặt Lại
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
