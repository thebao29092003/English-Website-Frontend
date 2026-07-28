import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
} from "@heroui/react";
import { IconBrandFacebook } from "@tabler/icons-react";
import ScrollToTop from "../../utility/ScrollToTop";
import { motion } from "motion/react";
import { useCreateContactMutation } from "../../API/callApi/contactApi";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../../utility/notification";
import { isRateLimitError } from "../../API/apiConfig/handleRateLimitError";

const contactSchema = yup.object().shape({
  name: yup
    .string()
    .required("Vui lòng nhập họ và tên của bạn")
    .min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  email: yup
    .string()
    .email("Địa chỉ email không hợp lệ")
    .required("Vui lòng nhập email"),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(
      /(?:^\+84|^84|^0)[35789]\d{8}$/,
      "Số điện thoại Việt Nam không hợp lệ",
    ),
  occupation: yup.string().required("Vui lòng nhập nghề nghiệp"),
  message: yup
    .string()
    .required("Vui lòng nhập nội dung liên hệ")
    .min(10, "Nội dung phải có ít nhất 10 ký tự"),
});

type ContactValues = yup.InferType<typeof contactSchema>;

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [createContact, { isLoading }] = useCreateContactMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      occupation: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactValues) => {
    try {
      const response = await createContact({
        fullName: data.name,
        email: data.email,
        phoneNumber: data.phone,
        occupation: data.occupation,
        content: data.message,
      }).unwrap();

      if (response.success) {
        showSuccessMessage(
          response.message || "Gửi thông tin liên hệ thành công!",
        );
        setIsSuccess(true);
        reset();
      } else {
        showErrorMessage(response.message || "Gửi thông tin thất bại!");
      }
    } catch (error: any) {
      if (!isRateLimitError(error)) {
        showErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại sau!");
      }
    }
  };

  return (
    <div
      id="contact-page-root"
      className="min-h-screen bg-[#05021c] text-white dark flex flex-col"
    >
      <main className="flex-1 pt-15 pb-15 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto mt-10 px-4 sm:px-6 relative z-10">
          {/* Document Header */}
          <div className="border-b border-white/10 pb-8 mb-8">
            <h1 className="font-display text-4xl py-3 sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-slate-200 to-gray-500">
              LIÊN HỆ VỚI CHÚNG TÔI
            </h1>
            <p className="text-sm font-mono text-gray-500 mt-3">
              EngSteps luôn đồng hành và lắng nghe ý kiến của bạn, đừng ngần
              ngại liên hệ với chúng tôi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Part: Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    Thông Tin Liên Hệ
                  </h2>
                  <p className="text-sm text-gray-400">
                    Nếu bạn có bất kỳ câu hỏi, góp ý hay yêu cầu hỗ trợ nào, hãy
                    liên lạc với chúng tôi qua các kênh dưới đây.
                  </p>
                </div>

                <div className="space-y-6 font-sans text-sm">
                  {/* Email */}
                  <div className="flex gap-4 items-start text-gray-300">
                    <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Email hỗ trợ</p>
                      <a
                        href="mailto:engsteps01@gmail.com"
                        className="text-gray-400 hover:text-blue-400 transition-colors mt-0.5 block text-xs sm:text-sm"
                      >
                        engsteps01@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex gap-4 items-start text-gray-300">
                    <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Giờ làm việc</p>
                      <p className="text-gray-400 mt-0.5 text-xs sm:text-sm">
                        Thứ 2 - Thứ Bảy: 08:00 - 17:30
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Kết nối với chúng tôi
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <IconBrandFacebook className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Part: Contact Form */}
            <div className="lg:col-span-7 font-sans">
              <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md relative">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Gửi liên hệ thành công!
                      </h3>
                      <p className="text-sm text-gray-400 max-w-md mx-auto">
                        Cảm ơn bạn đã phản hồi. Đội ngũ EngSteps sẽ xem xét nội
                        dung và phản hồi lại bạn sớm nhất có thể qua Email hoặc
                        Số điện thoại đã cung cấp.
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsSuccess(false)}
                      className="mt-6 h-11 px-6 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all text-sm cursor-pointer font-sans"
                    >
                      Gửi tin nhắn khác
                    </Button>
                  </motion.div>
                ) : (
                  <Form
                    validationBehavior="aria"
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5 w-full"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        Gửi Tin Nhắn Cho Chúng Tôi
                      </h2>
                      <p className="text-sm text-gray-400">
                        Vui lòng điền thông tin bên dưới, chúng tôi sẽ phản hồi
                        lại bạn trong vòng 24 giờ làm việc.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <TextField
                        isRequired
                        validationBehavior="aria"
                        isInvalid={!!errors.name}
                        className="flex flex-col w-full"
                      >
                        <Label className="text-sm font-semibold font-mono text-gray-400 mb-1.5 block">
                          Họ và tên
                        </Label>
                        <Input
                          id="contact-name-input"
                          placeholder="Nguyễn Văn A"
                          className="w-full border border-white/10 hover:border-purple-500/50 bg-white/5 text-white h-11 rounded-xl px-4 transition-all text-sm outline-none placeholder:text-gray-500"
                          {...register("name")}
                        />
                        <FieldError className="text-xs text-rose-500 mt-1 block">
                          {errors.name?.message}
                        </FieldError>
                      </TextField>

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
                          id="contact-email-input"
                          placeholder="name@example.com"
                          className="w-full border border-white/10 hover:border-purple-500/50 bg-white/5 text-white h-11 rounded-xl px-4 transition-all text-sm outline-none placeholder:text-gray-500"
                          {...register("email")}
                        />
                        <FieldError className="text-xs text-rose-500 mt-1 block">
                          {errors.email?.message}
                        </FieldError>
                      </TextField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone input */}
                      <TextField
                        isRequired
                        validationBehavior="aria"
                        isInvalid={!!errors.phone}
                        className="flex flex-col w-full"
                      >
                        <Label className="text-sm font-semibold font-mono text-gray-400 mb-1.5 block">
                          Số điện thoại
                        </Label>
                        <Input
                          id="contact-phone-input"
                          placeholder="0987654321"
                          className="w-full border border-white/10 hover:border-purple-500/50 bg-white/5 text-white h-11 rounded-xl px-4 transition-all text-sm outline-none placeholder:text-gray-500"
                          {...register("phone")}
                        />
                        <FieldError className="text-xs text-rose-500 mt-1 block">
                          {errors.phone?.message}
                        </FieldError>
                      </TextField>

                      {/* Occupation input */}
                      <TextField
                        isRequired
                        validationBehavior="aria"
                        isInvalid={!!errors.occupation}
                        className="flex flex-col w-full"
                      >
                        <Label className="text-sm font-semibold font-mono text-gray-400 mb-1.5 block">
                          Nghề nghiệp
                        </Label>
                        <Input
                          id="contact-occupation-input"
                          placeholder="Sinh viên, Học sinh, Kỹ sư..."
                          className="w-full border border-white/10 hover:border-purple-500/50 bg-white/5 text-white h-11 rounded-xl px-4 transition-all text-sm outline-none placeholder:text-gray-500"
                          {...register("occupation")}
                        />
                        <FieldError className="text-xs text-rose-500 mt-1 block">
                          {errors.occupation?.message}
                        </FieldError>
                      </TextField>
                    </div>

                    {/* Message / Textarea */}
                    <TextField
                      isRequired
                      validationBehavior="aria"
                      isInvalid={!!errors.message}
                      className="flex flex-col w-full"
                    >
                      <Label className="text-sm font-semibold font-mono text-gray-400 mb-1.5 block">
                        Nội dung liên hệ
                      </Label>
                      <textarea
                        id="contact-message-input"
                        placeholder="Nhập nội dung bạn muốn liên hệ hoặc đóng góp tại đây..."
                        rows={5}
                        className="w-full border border-white/10 hover:border-purple-500/50 bg-white/5 text-white rounded-xl p-4 transition-all text-sm outline-none placeholder:text-gray-500 resize-y min-h-[120px]"
                        {...register("message")}
                      />
                      <FieldError className="text-xs text-rose-500 mt-1 block">
                        {errors.message?.message}
                      </FieldError>
                    </TextField>

                    {/* Submit button */}
                    <Button
                      id="contact-submit-btn"
                      type="submit"
                      isDisabled={isLoading}
                      className="w-full h-12 mt-4 rounded-xl bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-98 transition-all cursor-pointer font-sans"
                    >
                      {isLoading ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Gửi Liên Hệ
                    </Button>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <ScrollToTop />
    </div>
  );
}
