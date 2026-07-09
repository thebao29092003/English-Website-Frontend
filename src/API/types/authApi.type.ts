import type { BaseResponse } from "./baseResponse";

// Định nghĩa đối tượng User
export interface User {
  userId: string;
  email: string;
  role: string;
  securityStamp: string;
}

// Định nghĩa State lưu trữ trong AuthSlice
export interface AuthState {
  user: User | null;
  token: string | null;
}

// Định nghĩa dữ liệu truyền lên khi Login (Request)
export interface LoginRequest {
  username: string;
  password: string; // Sửa lại tùy theo logic backend của bạn
}

// Định nghĩa dữ liệu trả về khi Login thành công (Response)
export interface LoginResponse extends BaseResponse<string> {}

export interface RegisterRequestStep2 {
  username: string;
  password: string;
  repeatPassword: string;
  otp: string;
}

export interface RefreshResponse extends BaseResponse<string> {}

export interface ResetPasswordRequest {
  username: string;
  otp: string;
  password: string;
  repeatPassword: string;
}

