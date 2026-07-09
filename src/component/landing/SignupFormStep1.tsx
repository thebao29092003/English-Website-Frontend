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
import { IconArrowRight, IconAlertCircle } from "@tabler/icons-react";
import {
  signupStep1Schema as step1Schema,
  type SignupStep1Values as Step1Values,
} from "./schema/langdingSchema";

interface SignupFormStep1Props {
  emailDefault?: string;
  agreeDefault?: boolean;
  isLoading: boolean;
  onSubmit: (data: Step1Values) => void;
}

export default function SignupFormStep1({
  emailDefault = "",
  agreeDefault = false,
  isLoading,
  onSubmit,
}: SignupFormStep1Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(step1Schema),
    defaultValues: {
      email: emailDefault,
      agree: agreeDefault,
    },
  });

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
          id="signup-email-input"
          placeholder="name@company.com"
          className="form-input"
          {...register("email")}
        />
        <FieldError className="form-error">{errors.email?.message}</FieldError>
      </TextField>

      {/* Consent checkbox */}
      <div className="flex flex-col gap-1.5 pt-1">
        <label className="flex items-start gap-1.5 cursor-pointer">
          <input
            id="signup-agree-checkbox"
            type="checkbox"
            className="mt-0.5 rounded border border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500/30 w-4 h-4 transition-all accent-purple-600 cursor-pointer"
            onChange={(e) =>
              setValue("agree", e.target.checked, {
                shouldValidate: true,
              })
            }
            defaultChecked={agreeDefault}
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
        {errors.agree && (
          <p className="text-sm text-rose-500 flex items-center gap-1 mt-1 font-mono">
            <IconAlertCircle className="w-3.5 h-3.5 shrink-0" />{" "}
            {errors.agree.message}
          </p>
        )}
      </div>

      {/* Step 1 Button */}
      <Button
        id="signup-next-btn"
        type="submit"
        isDisabled={isLoading}
        className="w-full h-12 mt-4 button-primary"
      >
        {isLoading ? <span className="spinner" /> : null}
        Tiếp tục nhận mã OTP
        <IconArrowRight className="w-4.5 h-4.5" />
      </Button>
    </Form>
  );
}
