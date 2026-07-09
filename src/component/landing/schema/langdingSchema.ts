import * as yup from "yup";

// Base email validation rule
export const emailSchemaRule = yup
  .string()
  .email("Địa chỉ email không hợp lệ")
  .required("Vui lòng nhập email");

// Common OTP validation rule
export const otpSchemaRule = yup
  .string()
  .required("Vui lòng nhập mã OTP")
  .length(6, "Mã OTP phải có đúng 6 chữ số")
  .matches(/^[0-9]+$/, "Mã OTP chỉ được chứa chữ số");

// Common password requirements helper
export const passwordSchemaRule = (requiredMessage: string) =>
  yup
    .string()
    .required(requiredMessage)
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
    .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số");

// Login Schema
export const loginSchema = yup.object().shape({
  email: emailSchemaRule,
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});
export type LoginValues = yup.InferType<typeof loginSchema>;

// Signup Step 1 Schema
export const signupStep1Schema = yup.object().shape({
  email: emailSchemaRule,
  agree: yup
    .boolean()
    .oneOf(
      [true],
      "Bạn phải đồng ý với Điều Khoản Dịch Vụ Và Chính Sách Bảo Mật",
    )
    .required(),
});
export type SignupStep1Values = yup.InferType<typeof signupStep1Schema>;

// Signup Step 2 Schema
export const signupStep2Schema = yup.object().shape({
  otp: otpSchemaRule,
  password: passwordSchemaRule("Vui lòng nhập mật khẩu"),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận lại mật khẩu")
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận lại không khớp"),
});
export type SignupStep2Values = yup.InferType<typeof signupStep2Schema>;

// Forgot Password Step 1 Schema
export const forgotPasswordStep1Schema = yup.object().shape({
  email: emailSchemaRule,
});
export type ForgotPasswordStep1Values = yup.InferType<typeof forgotPasswordStep1Schema>;

// Forgot Password Step 2 Schema
export const forgotPasswordStep2Schema = yup.object().shape({
  otp: otpSchemaRule,
  password: passwordSchemaRule("Vui lòng nhập mật khẩu mới"),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận lại mật khẩu")
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận lại không khớp"),
});
export type ForgotPasswordStep2Values = yup.InferType<typeof forgotPasswordStep2Schema>;
