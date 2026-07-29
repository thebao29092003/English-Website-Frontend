import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  forgotPasswordStep1Schema as step1Schema,
  type ForgotPasswordStep1Values as Step1Values,
} from "../landing/schema/langdingSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
} from "@heroui/react";
import { IconArrowRight, IconAlertCircle } from "@tabler/icons-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { TURNSTILE_SITE_KEY } from "../../config/turnstileConfig";
import { useLazyForgotPasswordSendOtpQuery } from "../../API/auth/authApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../utility/notification";
import { isRateLimitError } from "../../API/apiConfig/handleRateLimitError";
import ScrollToTop from "../../utility/ScrollToTop";

export default function ForgotPasswordStep1() {
  const navigate = useNavigate();
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [captchaError, setCaptchaError] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);

  const [sendOtp, { isFetching: isLoading }] =
    useLazyForgotPasswordSendOtpQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(step1Schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: Step1Values) => {
    if (!turnstileToken) {
      setCaptchaError("Vui lòng xác minh Captcha trước khi gửi!");
      return;
    }
    setCaptchaError("");

    try {
      const response = await sendOtp({
        email: data.email,
        turnstileToken,
      }).unwrap();
      if (response.success) {
        showSuccessMessage("Mã OTP đã được gửi tới email của bạn.");
        navigate("/reset-password", { state: { email: data.email } });
      }
    } catch (err: unknown) {
      turnstileRef.current?.reset();
      setTurnstileToken("");
      if (!isRateLimitError(err)) {
        showErrorMessage("Lỗi khi gửi email");
      }
    }
  };

  return (
    <div
      id="forgot-password-step1-root"
      className="forgot-password-root dark animate-fade-in"
    >
      <ScrollToTop />

      {/* Decorative background glows */}
      <div className="glow-orb top-20 left-1/4 w-96 h-96 bg-purple-500/10 blur-[120px]" />
      <div className="glow-orb bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px]" />

      <div className="max-w-md w-full relative z-10 ">
        {/* Card container */}
        <div className="forgot-password-card">
          {/* Top glowing bar */}
          <div className="forgot-password-glow-bar" />

          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="forgot-password-title">Quên Mật Khẩu</h2>
            <p className="forgot-password-subtitle">
              Bước 1: Nhập email để nhận mã xác thực OTP.
            </p>
          </div>

          {/* Form */}
          <Form
            validationBehavior="aria"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <TextField
              type="email"
              isRequired
              validationBehavior="aria"
              isInvalid={!!errors.email}
              className="flex flex-col w-full"
            >
              <Label className="form-label">Địa chỉ Email</Label>
              <Input
                id="forgot-email-input"
                placeholder="name@company.com"
                className="form-input"
                {...register("email")}
              />
              <FieldError className="form-error">
                {errors.email?.message}
              </FieldError>
            </TextField>

            {/* Cloudflare Turnstile CAPTCHA */}
            <div className="flex flex-col items-center justify-center my-4">
              <Turnstile
                ref={turnstileRef}
                siteKey={TURNSTILE_SITE_KEY}
                options={{
                  theme: "dark",
                  size: "normal",
                }}
                onSuccess={(token) => {
                  setTurnstileToken(token);
                  setCaptchaError("");
                }}
                onExpire={() => setTurnstileToken("")}
                onError={() => setTurnstileToken("")}
              />
              {captchaError && (
                <p className="text-xs text-rose-500 font-mono mt-1 flex items-center gap-1">
                  <IconAlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {captchaError}
                </p>
              )}
            </div>

            <Button
              id="forgot-submit-btn"
              type="submit"
              isDisabled={isLoading}
              className="w-full h-12 mt-6 button-primary"
            >
              {isLoading ? <span className="spinner" /> : null}
              Gửi Mã OTP
              <IconArrowRight className="w-4.5 h-4.5" />
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
