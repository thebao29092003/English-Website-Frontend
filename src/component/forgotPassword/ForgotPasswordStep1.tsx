import { useState } from "react";
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
import { IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { useLazyForgotPasswordSendOtpQuery } from "../../API/auth/authApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../utility/notification";
import ScrollToTop from "../../utility/ScrollToTop";


export default function ForgotPasswordStep1() {
  const navigate = useNavigate();
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
    try {
      const response = await sendOtp(data.email).unwrap();
      if (response.success) {
        showSuccessMessage("Mã OTP đã được gửi tới email của bạn.");
        navigate("/reset-password", { state: { email: data.email } });
      } else {
        showErrorMessage(response.message || "Gửi mã OTP thất bại");
      }
    } catch (err: any) {
      console.warn(
        "Forgot password API not ready, falling back to mock transition:",
        err,
      );
      showSuccessMessage("Giao diện: Một mã OTP demo đã được gửi.");
      navigate("/reset-password", { state: { email: data.email } });
    }
  };

  return (
    <div
      id="forgot-password-step1-root"
      className="w-full min-h-screen overflow-x-hidden bg-[#030014] text-white dark flex flex-col items-center justify-center relative px-4 pt-28 pb-16 animate-fade-in"
    >
      <ScrollToTop />

      {/* Decorative background glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 ">
        {/* Card container */}
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-md p-6 sm:p-8 shadow-2xl bg-[#030014]/85 border border-white/10 text-white w-full">
          {/* Top glowing bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />

          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black tracking-tight mb-2">
              Quên Mật Khẩu
            </h2>
            <p className="text-sm text-gray-400">
              Bước 1: Nhập email để nhận mã xác thực OTP đặt lại mật khẩu.
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
              <Label className="text-sm font-semibold font-mono text-gray-400 mb-1.5 block">
                Địa chỉ Email
              </Label>
              <Input
                id="forgot-email-input"
                placeholder="name@company.com"
                className="w-full border border-white/10 hover:border-purple-500/50 bg-white/5 text-white h-11 rounded-xl px-4 transition-all text-sm outline-none placeholder:text-gray-500"
                {...register("email")}
              />
              <FieldError className="text-sm text-rose-500 mt-1 block">
                {errors.email?.message}
              </FieldError>
            </TextField>

            <Button
              id="forgot-submit-btn"
              type="submit"
              isDisabled={isLoading}
              className="w-full h-12 mt-4 button-primary"
            >
              {isLoading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : null}
              Gửi Mã OTP
              <IconArrowRight className="w-4.5 h-4.5" />
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
