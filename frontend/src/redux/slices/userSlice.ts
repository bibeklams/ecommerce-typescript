import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { UserListResponse, User } from "../../types/user";

import {
  getAllUsers,
  getSingleUser,
  deleteUser,
} from "../../services/user.service";

export type GetUsersParams = {
  search?: string;
  page?: number;
  limit?: number;
};

interface UserState {
  users: User[];
  user: User | null;

  page: number;
  limit: number;
  totalPages: number;

  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  user: null,

  page: 1,
  limit: 10,
  totalPages: 0,

  loading: false,
  error: null,
};

export const getAllUsersThunk = createAsyncThunk<
  UserListResponse,
  GetUsersParams | undefined
>("/users/getAllUsers", async ({ search = "", page = 1, limit = 10 } = {}) => {
  const response = await getAllUsers(search, page, limit);
  return response;
});

export const getSingleUserThunk = createAsyncThunk<User, number>(
  "/users/getSingleUser",
  async (userId) => {
    const response = await getSingleUser(userId);
    return response;
  },
);
export const deleteUserThunk = createAsyncThunk<User, number>(
  "/users/deleteUser",
  async (userId) => {
    const response = await deleteUser(userId);
    return response;
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllUsersThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllUsersThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.users;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.limit = action.payload.limit;
      state.error = null;
    });
    builder.addCase(getAllUsersThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No data found";
    });
    //getSingleUser
    builder.addCase(getSingleUserThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getSingleUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(getSingleUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No data found";
    });
    //deleteUser
    builder.addCase(deleteUserThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.users = state.users.filter((user) => user.id !== action.payload.id);
      if (state.user?.id === action.payload.id) {
        state.user = null;
      }
      state.error = null;
    });
    builder.addCase(deleteUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No data found";
    });
  },
});

export default userSlice.reducer;
