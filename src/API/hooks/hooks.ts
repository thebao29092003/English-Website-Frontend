import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";

// Sử dụng `useAppDispatch` và `useAppSelector` xuyên suốt ứng dụng thay vì hooks gốc
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
