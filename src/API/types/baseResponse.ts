export interface BaseResponse<T> {
  status: string;
  message: string;
  responseId: string;
  endPointCode: string;
  success: boolean;
  value: T | null;
}
