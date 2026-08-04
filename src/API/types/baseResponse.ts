export interface BaseResponse<T> {
  status: number;
  message: string;
  responseId: string;
  endPointCode: string;
  success: boolean;
  value: T | null;
}
