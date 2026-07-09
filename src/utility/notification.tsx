import { toast, type ToastOptions } from "react-toastify";
import { Alert } from "@heroui/react";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  icon: false, // Turn off default icon to use HeroUI Alert indicator
};

export const showSuccessMessage = (message: string) => {
  toast(
    <Alert
      status="success"
      className="bg-transparent border-none shadow-none p-0 text-white"
    >
      <Alert.Indicator className="text-purple-400 [&>svg]:w-5.5 [&>svg]:h-5.5" />
      <Alert.Content className="ml-[-10px]">
        <Alert.Title className="text-sm font-semibold text-purple-300 uppercase tracking-wider font-mono">
          Thành công
        </Alert.Title>
        <Alert.Description className="text-sm font-medium text-white leading-tight mt-0.2">
          {message}
        </Alert.Description>
      </Alert.Content>
    </Alert>,
    {
      ...defaultOptions,
      style: {
        background: "rgba(10, 8, 30, 0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(139, 92, 246, 0.3)",
        boxShadow:
          "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(139, 92, 246, 0.2)",
        borderRadius: "16px",
        overflow: "hidden",
        padding: "16px",
      },
    } as any,
  );
};

export const showErrorMessage = (message: string) => {
  toast.error(
    <Alert
      status="danger"
      className="bg-transparent border-none shadow-none p-0 text-white"
    >
      <Alert.Indicator className="text-rose-400 [&>svg]:w-5.5 [&>svg]:h-5.5" />
      <Alert.Content className="ml-[-10px]">
        <Alert.Title className="text-xs font-semibold text-rose-400 uppercase tracking-wider font-mono">
          Lỗi xảy ra
        </Alert.Title>
        <Alert.Description className="text-sm font-medium text-white leading-tight mt-0.2">
          {message}
        </Alert.Description>
      </Alert.Content>
    </Alert>,
    {
      ...defaultOptions,
      style: {
        background: "rgba(10, 8, 30, 0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(244, 63, 94, 0.3)",
        boxShadow:
          "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(244, 63, 94, 0.2)",
        borderRadius: "16px",
        overflow: "hidden",
        padding: "16px",
      },
      progressStyle: {
        background: "#fb7185", // text-rose-400 color
      },
    } as any,
  );
};
