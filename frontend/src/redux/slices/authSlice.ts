import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { User } from "../../types/user";

import {
  profile,
  register as registerUser,
  login as loginUser,
  logout as logoutUser,
} from "../../services/auth.service";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  authChecked: boolean;
}

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  authChecked: false,
};

export const getProfile = createAsyncThunk<User>(
  "auth/getProfile",
  async () => {
    const response = await profile();
    return response;
  },
);

export const register = createAsyncThunk<User, RegisterData>(
  "auth/register",
  async (data) => {
    const response = await registerUser(data);
    return response;
  },
);
export const login = createAsyncThunk<User, LoginData>(
  "auth/login",
  async (data) => {
    const response = await loginUser(data);
    return response;
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutUser();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Profile
    builder.addCase(getProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.authChecked = true;
    });

    builder.addCase(getProfile.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.authChecked = true;
      state.error = action.error.message ?? "Failed to get profile";
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });

    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Registration failed";
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });

    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Login failed";
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
    });

    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Logout failed";
    });
  },
});

export default authSlice.reducer;
