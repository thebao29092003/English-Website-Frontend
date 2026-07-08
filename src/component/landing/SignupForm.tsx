import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion, AnimatePresence } from "motion/react";
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
} from "@heroui/react";
import {
  IconArrowRight,
  IconArrowLeft,
  IconRefresh,
  IconEye,
  IconEyeOff,
  IconCircleCheck,
  IconAlertCircle,
} from "@tabler/icons-react";

// Schema for Step 1 (Removed Full Name "name" field)
const step1Schema = yup.object().shape({
  email: yup
    .string()
    .email("Địa chỉ email không hợp lệ")
    .required("Vui lòng nhập email"),
  agree: yup
    .boolean()
    .oneOf(
      [true],
      "Bạn phải đồng ý với Điều Khoản Dịch Vụ Và Chính Sách Bảo Mật",
    )
    .required(),
});

// Schema for Step 2
const step2Schema = yup.object().shape({
  otp: yup
    .string()
    .required("Vui lòng nhập mã OTP")
    .length(6, "Mã OTP phải có đúng 6 chữ số")
    .matches(/^[0-9]+$/, "Mã OTP chỉ được chứa chữ số"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
    .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số"),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận lại mật khẩu")
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận lại không khớp"),
});

type Step1Values = yup.InferType<typeof step1Schema>;
type Step2Values = yup.InferType<typeof step2Schema>;

export default function SignupForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<Partial<Step1Values & Step2Values>>(
    {},
  );
  const [countdown, setCountdown] = useState(0);
  const [otpSentMessage, setOtpSentMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Step 1 Form Handler
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    setValue: setValueStep1,
    formState: { errors: errorsStep1 },
  } = useForm({
    resolver: yupResolver(step1Schema),
    defaultValues: {
      email: formData.email || "",
      agree: formData.agree || false,
    },
  });

  // Step 2 Form Handler
  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    watch: watchStep2,
    formState: { errors: errorsStep2 },
  } = useForm({
    resolver: yupResolver(step2Schema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password value to dynamically render strength indicators
  const passwordValue = watchStep2("password") || "";

  // Password rules validation states
  const passwordRules = {
    length: passwordValue.length >= 8,
    lowercase: /[a-z]/.test(passwordValue),
    uppercase: /[A-Z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
  };

  // Countdown timer logic for Resend OTP (40s)
  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prev) => prev - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle Step 1 Submit (Move to Step 2)
  const onStep1Submit = (data: Step1Values) => {};

  // Handle Step 2 Submit (Finalize Registration)
  const onStep2Submit = (_data: Step2Values) => {};

  // Handle Resend OTP Click (40s cooling)
  const handleResendOtp = () => {
    if (countdown > 0) return;
    setCountdown(40);
    setOtpSentMessage("Một mã OTP mới đã được gửi tới email của bạn.");
    setTimeout(() => setOtpSentMessage(""), 5000);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Form
              validationBehavior="aria"
              onSubmit={handleSubmitStep1(onStep1Submit)}
              className="space-y-6 w-full"
            >
              {/* Email input */}
              <TextField
                type="email"
                isRequired
                validationBehavior="aria"
                isInvalid={!!errorsStep1.email}
                className="flex flex-col w-full"
              >
                <Label className="text-sm font-semibold font-mono text-gray-400 mb-1.5 block">
                  Địa chỉ Email
                </Label>
                <Input
                  id="signup-email-input"
                  placeholder="name@company.com"
                  className="w-full border border-white/10 hover:border-purple-500/50 bg-white/5 text-white h-11 rounded-xl px-4 transition-all text-sm outline-none placeholder:text-gray-500"
                  {...registerStep1("email")}
                />
                <FieldError className="text-sm text-rose-500 mt-1 block">
                  {errorsStep1.email?.message}
                </FieldError>
              </TextField>

              {/* Consent checkbox */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="flex items-start gap-1.5 cursor-pointer">
                  <input
                    id="signup-agree-checkbox"
                    type="checkbox"
                    className="mt-0.5 rounded border border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500/30 w-4 h-4 transition-all accent-purple-600 cursor-pointer"
                    onChange={(e) =>
                      setValueStep1("agree", e.target.checked, {
                        shouldValidate: true,
                      })
                    }
                    defaultChecked={formData.agree || false}
                  />
                  <span className="text-sm text-gray-400 select-none">
                    Tôi đồng ý với{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-400 cursor-pointer"
                    >
                      Điều Khoản Dịch Vụ
                    </a>{" "}
                    và{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-400 cursor-pointer"
                    >
                      Chính Sách Bảo Mật
                    </a>
                  </span>
                </label>
                {errorsStep1.agree && (
                  <p className="text-sm text-rose-500 flex items-center gap-1 mt-1 font-mono">
                    <IconAlertCircle className="w-3.5 h-3.5 shrink-0" />{" "}
                    {errorsStep1.agree.message}
                  </p>
                )}
              </div>

              {/* Step 1 Button */}
              <Button
                id="signup-next-btn"
                type="submit"
                // isDisabled={loading}
                className="w-full h-12 mt-4 rounded-xl bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-98 transition-all cursor-pointer"
              >
                Tiếp tục nhận mã OTP
                <IconArrowRight className="w-4.5 h-4.5" />
              </Button>
            </Form>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Form
              validationBehavior="aria"
              onSubmit={handleSubmitStep2(onStep2Submit)}
              className="space-y-6 w-full"
            >
              {/* Back to Step 1 Button */}
              <button
                type="button"
                onClick={() => setStep(1)}
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
                isInvalid={!!errorsStep2.otp}
                className="flex flex-col w-full"
              >
                <Label className="text-sm font-semibold font-mono text-gray-400 mb-1.5 block">
                  Nhập Mã OTP
                </Label>
                <Input
                  id="signup-otp-input"
                  maxLength={6}
                  placeholder="OTP"
                  className="w-full border border-white/10 hover:border-purple-500/50 bg-white/5 text-white h-11 rounded-xl px-4 transition-all text-sm outline-none placeholder:text-gray-500"
                  {...registerStep2("otp")}
                />
                <FieldError className="text-sm text-rose-500 mt-1 block">
                  {errorsStep2.otp?.message}
                </FieldError>
              </TextField>

              {/* Password input */}
              <TextField
                isRequired
                validationBehavior="aria"
                isInvalid={!!errorsStep2.password}
                className="flex flex-col w-full"
              >
                <Label className="text-sm font-semibold font-mono text-gray-400 mb-1.5 block">
                  Mật khẩu mới
                </Label>
                <div className="relative w-full border border-white/10 hover:border-purple-500/50 bg-white/5 text-white h-11 rounded-xl transition-all flex items-center">
                  <Input
                    id="signup-password-input"
                    type={showPasswords ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-white text-sm px-4 outline-none placeholder:text-gray-500 h-full border-none"
                    {...registerStep2("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="text-gray-500 absolute right-3 hover:text-white transition-colors cursor-pointer focus:outline-none"
                  >
                    {showPasswords ? (
                      <IconEyeOff size={20} />
                    ) : (
                      <IconEye size={20} />
                    )}
                  </button>
                </div>
                <FieldError className="text-sm text-rose-500 mt-1 block">
                  {errorsStep2.password?.message}
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
                isInvalid={!!errorsStep2.confirmPassword}
                className="flex flex-col w-full"
              >
                <Label className="text-sm font-semibold font-mono text-gray-400 mb-1.5 block">
                  Nhập lại Mật khẩu
                </Label>
                <div className="relative w-full border border-white/10 hover:border-purple-500/50 bg-white/5 text-white h-11 rounded-xl transition-all flex items-center">
                  <Input
                    id="signup-confirm-password-input"
                    type={showPasswords ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-white text-sm px-4 outline-none placeholder:text-gray-500 h-full border-none"
                    {...registerStep2("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="text-gray-500 absolute right-3 hover:text-white transition-colors cursor-pointer focus:outline-none"
                  >
                    {showPasswords ? (
                      <IconEyeOff size={20} />
                    ) : (
                      <IconEye size={20} />
                    )}
                  </button>
                </div>
                <FieldError className="text-sm text-rose-500 mt-1 block">
                  {errorsStep2.confirmPassword?.message}
                </FieldError>
              </TextField>

              {/* Two buttons action row */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                {/* Resend OTP button */}
                <Button
                  type="button"
                  id="signup-resend-otp"
                  onClick={handleResendOtp}
                  isDisabled={countdown > 0}
                  className={`h-12 rounded-xl text-sm font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                    countdown > 0
                      ? "bg-white/2 border-white/5 text-gray-500 cursor-not-allowed"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-white cursor-pointer"
                  }`}
                >
                  <IconRefresh
                    className={`w-3.5 h-3.5 ${countdown > 0 ? "" : "animate-spin-slow"}`}
                  />
                  {countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi lại OTP"}
                </Button>
                {/* Final Register Button */}
                <Button
                  id="signup-submit-btn"
                  type="submit"
                  // isDisabled={loading}
                  className="h-12 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20 active:scale-98 transition-all cursor-pointer"
                ></Button>
                Hoàn Tất Đăng Ký
              </div>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
