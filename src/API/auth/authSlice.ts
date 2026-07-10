import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../types/authApi.type";
import type { RootState } from "../store";

// Kiểm tra xem có token trong localStorage không
const token = localStorage.getItem("token");
const userStr = localStorage.getItem("user");

// user là object gồm userId, email, role, phone, fullname
// còn token là access token
const initialState: AuthState = {
  // convert userStr từ json string sang object nếu có, nếu không thì null
  user: userStr ? (JSON.parse(userStr) as User) : null,
  token: token || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;

      // Lưu token và user vào localStorage
      localStorage.setItem("token", token);
      // JSON.stringify: chuyển object thành json string
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      // Xóa token và user khỏi localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // console.log('After logout:', state);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state?.auth?.user;
export const selectCurrentToken = (state: RootState) => state?.auth?.token;

export default authSlice.reducer;
