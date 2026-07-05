import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion, AnimatePresence } from "motion/react";
import { 
  IconMail, 
  IconLock, 
  IconUser, 
  IconArrowRight, 
  IconArrowLeft, 
  IconDeviceMobile, 
  IconRefresh, 
  IconEye, 
  IconEyeOff,
  IconCircleCheck,
  IconAlertCircle
} from "@tabler/icons-react";

interface SignupFormProps {
  onSuccess: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isDark: boolean;
}

// Schema for Step 1
const step1Schema = yup.object().shape({
  name: yup
    .string()
    .required("Vui lòng nhập họ và tên của bạn")
    .min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: yup
    .string()
    .email("Địa chỉ email không hợp lệ")
    .required("Vui lòng nhập email"),
  agree: yup
    .boolean()
    .oneOf([true], "Bạn phải đồng ý với Điều khoản và Chính sách bảo mật")
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

export default function SignupForm({ onSuccess, loading, setLoading, isDark }: SignupFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<Partial<Step1Values & Step2Values>>({});
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
      name: formData.name || "",
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
    let timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prev) => prev - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle Step 1 Submit (Move to Step 2)
  const onStep1Submit = (data: Step1Values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormData(data);
      setStep(2);
      // Start 40s countdown
      setCountdown(40);
      setOtpSentMessage(`Mã OTP đã được gửi thành công tới ${data.email}`);
      // Clear toast after 5s
      setTimeout(() => setOtpSentMessage(""), 5000);
    }, 1000);
  };

  // Handle Step 2 Submit (Finalize Registration)
  const onStep2Submit = (data: Step2Values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

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
            <form onSubmit={handleSubmitStep1(onStep1Submit)} className="space-y-4">
              <p className="text-xs mb-2 text-gray-400">
                Bước 1: Xác nhận thông tin email tài khoản của bạn để nhận mã OTP.
              </p>

              {/* Name input */}
              <CustomInput
                id="signup-name-input"
                type="text"
                label="Họ và Tên"
                placeholder="Nguyễn Văn A"
                labelPlacement="outside"
                startContent={<IconUser className="text-gray-500 w-4.5 h-4.5 shrink-0" />}
                isInvalid={!!errorsStep1.name}
                errorMessage={errorsStep1.name?.message}
                {...registerStep1("name")}
                classNames={{
                  label: "text-xs font-semibold font-mono text-gray-400 mb-1.5 block",
                  inputWrapper: "border border-white/10 hover:border-purple-500/50 focus-within:!border-purple-500 bg-white/5 text-white h-11 rounded-xl transition-all",
                  input: "text-white placeholder:text-gray-500 text-sm",
                }}
              />

              {/* Email input */}
              <CustomInput
                id="signup-email-input"
                type="email"
                label="Địa chỉ Email"
                placeholder="name@company.com"
                labelPlacement="outside"
                startContent={<IconMail className="text-gray-500 w-4.5 h-4.5 shrink-0" />}
                isInvalid={!!errorsStep1.email}
                errorMessage={errorsStep1.email?.message}
                {...registerStep1("email")}
                classNames={{
                  label: "text-xs font-semibold font-mono text-gray-400 mb-1.5 block",
                  inputWrapper: "border border-white/10 hover:border-purple-500/50 focus-within:!border-purple-500 bg-white/5 text-white h-11 rounded-xl transition-all",
                  input: "text-white placeholder:text-gray-500 text-sm",
                }}
              />

              {/* Consent checkbox */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    id="signup-agree-checkbox"
                    type="checkbox"
                    className="mt-0.5 rounded border border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500/30 w-4 h-4 transition-all accent-purple-600 cursor-pointer"
                    onChange={(e) => (setValueStep1 as any)("agree", e.target.checked, { shouldValidate: true })}
                    defaultChecked={formData.agree || false}
                  />
                  <span className="text-xs text-gray-400 select-none">
                    Tôi đồng ý với{" "}
                    <a href="#" className="hover:underline text-blue-400">Điều khoản Dịch vụ</a> và{" "}
                    <a href="#" className="hover:underline text-blue-400">Chính sách Bảo mật</a> của EngSteps.
                  </span>
                </label>
                {errorsStep1.agree && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-mono">
                    <IconAlertCircle className="w-3.5 h-3.5 shrink-0" /> {errorsStep1.agree.message}
                  </p>
                )}
              </div>

              {/* Step 1 Button */}
              <CustomButton
                id="signup-next-btn"
                type="submit"
                isLoading={loading}
                className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-98 transition-all cursor-pointer"
                endContent={!loading && <IconArrowRight className="w-4.5 h-4.5" />}
              >
                Tiếp tục nhận mã OTP
              </CustomButton>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmitStep2(onStep2Submit)} className="space-y-4">
              
              {/* Back to Step 1 Button */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs transition-colors mb-2 font-mono text-gray-400 hover:text-white cursor-pointer"
              >
                <IconArrowLeft className="w-3.5 h-3.5" /> Quay lại Bước 1
              </button>

              {/* Success Notification Alert */}
              {otpSentMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5 animate-pulse">
                  <IconCircleCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{otpSentMessage}</span>
                </div>
              )}

              {/* OTP Input */}
              <CustomInput
                id="signup-otp-input"
                type="text"
                maxLength={6}
                label="Nhập Mã OTP (6 chữ số)"
                placeholder="123456"
                labelPlacement="outside"
                startContent={<IconDeviceMobile className="text-gray-500 w-4.5 h-4.5 shrink-0" />}
                isInvalid={!!errorsStep2.otp}
                errorMessage={errorsStep2.otp?.message}
                {...registerStep2("otp")}
                classNames={{
                  label: "text-xs font-semibold font-mono text-gray-400 mb-1.5 block",
                  inputWrapper: "border border-white/10 hover:border-purple-500/50 focus-within:!border-purple-500 bg-white/5 text-white h-11 rounded-xl transition-all",
                  input: "text-white placeholder:text-gray-500 text-sm",
                }}
              />

              {/* Password input */}
              <CustomInput
                id="signup-password-input"
                type={showPasswords ? "text" : "password"}
                label="Mật khẩu mới"
                placeholder="••••••••"
                labelPlacement="outside"
                startContent={<IconLock className="text-gray-500 w-4.5 h-4.5 shrink-0" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="text-gray-500 hover:text-white transition-colors cursor-pointer focus:outline-none"
                  >
                    {showPasswords ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                  </button>
                }
                isInvalid={!!errorsStep2.password}
                errorMessage={errorsStep2.password?.message}
                {...registerStep2("password")}
                classNames={{
                  label: "text-xs font-semibold font-mono text-gray-400 mb-1.5 block",
                  inputWrapper: "border border-white/10 hover:border-purple-500/50 focus-within:!border-purple-500 bg-white/5 text-white h-11 rounded-xl transition-all",
                  input: "text-white placeholder:text-gray-500 text-sm",
                }}
              />

              {/* Password Rules Indicators */}
              <div className="p-3 rounded-xl mt-2 grid grid-cols-2 gap-2 text-[11px] font-mono border bg-white/[0.02] border-white/5">
                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[9px] ${
                    passwordRules.length 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                      : "bg-red-500/5 border-red-500/20 text-red-400"
                  }`}>
                    {passwordRules.length ? "✓" : "✗"}
                  </div>
                  <span className={passwordRules.length ? "text-emerald-400 font-semibold" : "text-gray-500"}>
                    Ít nhất 8 ký tự
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[9px] ${
                    passwordRules.lowercase 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                      : "bg-red-500/5 border-red-500/20 text-red-400"
                  }`}>
                    {passwordRules.lowercase ? "✓" : "✗"}
                  </div>
                  <span className={passwordRules.lowercase ? "text-emerald-400 font-semibold" : "text-gray-500"}>
                    1 chữ thường
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[9px] ${
                    passwordRules.uppercase 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                      : "bg-red-500/5 border-red-500/20 text-red-400"
                  }`}>
                    {passwordRules.uppercase ? "✓" : "✗"}
                  </div>
                  <span className={passwordRules.uppercase ? "text-emerald-400 font-semibold" : "text-gray-500"}>
                    1 chữ hoa
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[9px] ${
                    passwordRules.number 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                      : "bg-red-500/5 border-red-500/20 text-red-400"
                  }`}>
                    {passwordRules.number ? "✓" : "✗"}
                  </div>
                  <span className={passwordRules.number ? "text-emerald-400 font-semibold" : "text-gray-500"}>
                    1 chữ số
                  </span>
                </div>
              </div>

              {/* Confirm Password input */}
              <CustomInput
                id="signup-confirm-password-input"
                type={showPasswords ? "text" : "password"}
                label="Nhập lại Mật khẩu"
                placeholder="••••••••"
                labelPlacement="outside"
                startContent={<IconLock className="text-gray-500 w-4.5 h-4.5 shrink-0" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="text-gray-500 hover:text-white transition-colors cursor-pointer focus:outline-none"
                  >
                    {showPasswords ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                  </button>
                }
                isInvalid={!!errorsStep2.confirmPassword}
                errorMessage={errorsStep2.confirmPassword?.message}
                {...registerStep2("confirmPassword")}
                classNames={{
                  label: "text-xs font-semibold font-mono text-gray-400 mb-1.5 block",
                  inputWrapper: "border border-white/10 hover:border-purple-500/50 focus-within:!border-purple-500 bg-white/5 text-white h-11 rounded-xl transition-all",
                  input: "text-white placeholder:text-gray-500 text-sm",
                }}
              />

              {/* Two buttons action row */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                {/* Resend OTP button */}
                <CustomButton
                  type="button"
                  id="signup-resend-otp"
                  onClick={handleResendOtp}
                  disabled={countdown > 0}
                  className={`h-12 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                    countdown > 0
                      ? "bg-white/[0.02] border-white/5 text-gray-500 cursor-not-allowed"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-white cursor-pointer"
                  }`}
                  startContent={<IconRefresh className={`w-3.5 h-3.5 ${countdown > 0 ? "" : "animate-spin-slow"}`} />}
                >
                  {countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi lại OTP"}
                </CustomButton>

                {/* Final Register Button */}
                <CustomButton
                  id="signup-submit-btn"
                  type="submit"
                  isLoading={loading}
                  className="h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  Hoàn Tất Đăng Ký
                </CustomButton>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
