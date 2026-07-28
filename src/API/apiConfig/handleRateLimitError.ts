import { showErrorMessage } from "../../utility/notification";
import type { BaseResponse } from "../types/baseResponse";

/**
 * Kiểm tra xem error object trả về từ RTK Query / fetchBaseQuery có phải lỗi 429 Rate Limit không.
 */
export const isRateLimitError = (error: any): boolean => {
  if (!error) return false;
  return error.status === 429 || error.data?.status === 429;
};

/**
 * Kiểm tra xem response có phải lỗi 429 (Rate Limit Exceeded) không và hiển thị thông báo toast.
 */
export const checkAndShowRateLimitError = (result: {
  error?: { status?: number | string; data?: unknown };
}): boolean => {
  if (!result?.error) return false;

  if (isRateLimitError(result.error)) {
    const data = result.error.data as BaseResponse<null> | undefined;
    const message = data?.message || "Vui lòng thử lại sau 60 giây.";
    showErrorMessage(message);
    return true;
  }

  return false;
};
