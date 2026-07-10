import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  useLazyGetOtpQuery,
  useRegisterMutation,
} from "../../API/auth/authApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../utility/notification";
import {
  type SignupStep1Values as Step1Values,
  type SignupStep2Values as Step2Values,
} from "./schema/langdingSchema";
import SignupFormStep1 from "./SignupFormStep1";
import SignupFormStep2 from "./SignupFormStep2";

interface SignupFormProps {
  setAuthOpen: (open: boolean) => void;
}

export default function SignupForm({ setAuthOpen }: SignupFormProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<Partial<Step1Values & Step2Values>>(
    {},
  );
  const [countdown, setCountdown] = useState(0);
  const [otpSentMessage, setOtpSentMessage] = useState("");

  const [getOtp, { isFetching: isOtpLoading }] = useLazyGetOtpQuery();
  const [registerUser, { isLoading: isRegisterLoading }] =
    useRegisterMutation();

  // Countdown timer logic for Resend OTP (30s cooling)
  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle Step 1 Submit (Verify Email & request OTP)
  const onStep1Submit = async (data: Step1Values) => {
    try {
      const response = await getOtp(data.email).unwrap();
      if (response.success) {
        setFormData({ email: data.email, agree: data.agree });
        setOtpSentMessage("Một mã OTP đã được gửi tới email của bạn.");
        setStep(2);
        setCountdown(30);
        setTimeout(() => setOtpSentMessage(""), 5000);
      }
    } catch (err: any) {
      if (err?.data?.message === "Account already exists.") {
        showErrorMessage("Tài khoản đã tồn tại.");
      } else {
        showErrorMessage("Gửi mã OTP thất bại");
      }
    }
  };

  // Handle Step 2 Submit (Final Registration)
  const onStep2Submit = async (data: Step2Values) => {
    if (!formData.email) {
      showErrorMessage(
        "Thông tin email không tìm thấy, vui lòng quay lại bước 1",
      );
      return;
    }
    try {
      const response = await registerUser({
        username: formData.email,
        password: data.password,
        repeatPassword: data.confirmPassword,
        otp: data.otp,
      }).unwrap();

      if (response.success) {
        showSuccessMessage("Đăng ký tài khoản thành công!");
        setAuthOpen(false);
        navigate("/home");
      }
    } catch (err: any) {
      showErrorMessage("Đăng ký thất bại");
    }
  };

  // Handle Resend OTP Click
  const handleResendOtp = async () => {
    if (countdown > 0 || isOtpLoading || !formData.email) return;
    try {
      const response = await getOtp(formData.email).unwrap();
      if (response.success) {
        setCountdown(30);
        setOtpSentMessage("Một mã OTP mới đã được gửi tới email của bạn.");
        setTimeout(() => setOtpSentMessage(""), 5000);
      }
    } catch (err: any) {
      showErrorMessage("Gửi lại OTP thất bại");
    }
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
            <SignupFormStep1
              emailDefault={formData.email}
              agreeDefault={formData.agree}
              isLoading={isOtpLoading}
              onSubmit={onStep1Submit}
            />
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SignupFormStep2
              email={formData.email || ""}
              otpSentMessage={otpSentMessage}
              countdown={countdown}
              isOtpLoading={isOtpLoading}
              isRegisterLoading={isRegisterLoading}
              onBack={() => setStep(1)}
              onResendOtp={handleResendOtp}
              onSubmit={onStep2Submit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
